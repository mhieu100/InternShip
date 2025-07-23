package com.mhieu.camera_service.service;

import java.io.*;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;

import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.repository.CameraRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {
    private static final String BASE_DIR = "/home/mhieu/Coding/GitHub/exercise/camera-service";
    private static final String VIDEO_DIR = BASE_DIR + "/videos";

    private final CameraRepository cameraRepository;
    private final Map<Long, StreamInfo> runningStreams = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

    private static class StreamInfo {
        Process process;
        ScheduledFuture<?> healthCheck;
        ScheduledFuture<?> segmentCleaner;
        long startTime;
        int restartAttempts;
        String quality;
        volatile boolean isShuttingDown;
        volatile boolean isInitialized;
        volatile String lastError;

        StreamInfo(Process process, String quality) {
            this.process = process;
            this.startTime = System.currentTimeMillis();
            this.restartAttempts = 0;
            this.quality = quality;
            this.isShuttingDown = false;
            this.isInitialized = false;
            this.lastError = null;
        }
    }

    @PostConstruct
    public void init() {
        try {
            createDirectoryWithPermissions(VIDEO_DIR);
            cleanAllStreams();
            System.out.println("[Init] Stream service ready");
        } catch (IOException e) {
            System.out.println("[Init Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    private void createDirectoryWithPermissions(String path) throws IOException {
        File dir = new File(path);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create: " + path);
        }
        if (!dir.canWrite() && !dir.setWritable(true, false)) {
            throw new IOException("Failed to set write permissions: " + path);
        }
    }

    private void cleanAllStreams() {
        try {
            File videoDir = new File(VIDEO_DIR);
            File[] cameraDirs = videoDir.listFiles(File::isDirectory);
            if (cameraDirs != null) {
                for (File dir : cameraDirs) {
                    FileSystemUtils.deleteRecursively(dir);
                }
            }
            System.out.println("[Clean] All streams cleaned");
        } catch (Exception e) {
            System.out.println("[Clean Error] " + e.getMessage());
        }
    }

    private String getCameraDirectory(Long cameraId) {
        return VIDEO_DIR + "/" + cameraId;
    }

    private void createOutputDirectory(Long cameraId) throws IOException {
        String cameraDir = getCameraDirectory(cameraId);
        createDirectoryWithPermissions(cameraDir);
        cleanupAllSegments(cameraId);
        System.out.println("[Dir] Created: " + cameraDir);
    }

    private Process startFFmpegProcess(Camera camera, Long cameraId, String quality) {
        String[] command = buildFFmpegCommand(camera, quality);
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);

        System.out.println("[FFmpeg] Starting camera " + cameraId);

        try {
            Process process = processBuilder.start();

            try {
                Thread.sleep(1000);
                int exitValue = process.exitValue();
                System.out.println("[FFmpeg Error] Process exited with code " + exitValue);
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            } catch (IllegalThreadStateException e) {
                System.out.println("[FFmpeg] Process running");
            }

            return process;
        } catch (IOException | InterruptedException e) {
            System.out.println("[FFmpeg Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    private String[] buildFFmpegCommand(Camera camera, String quality) {
        Map<String, String[]> qualityPresets = Map.of(
                "low", new String[] { "500k", "baseline", "ultrafast" },
                "medium", new String[] { "1000k", "main", "veryfast" },
                "high", new String[] { "2000k", "high", "faster" });

        String[] qualitySettings = qualityPresets.getOrDefault(quality, qualityPresets.get("medium"));
        String bitrate = qualitySettings[0];
        String profile = qualitySettings[1];
        String preset = qualitySettings[2];

        String outputDir = getCameraDirectory(camera.getId());
        System.out.println("[FFmpeg] Output: " + outputDir);

        return new String[] {
                "ffmpeg",
                "-rtsp_transport", "tcp",
                "-i", camera.getIpAddress(),
                "-c:v", "libx264",
                "-preset", preset,
                "-tune", "zerolatency",
                "-profile:v", profile,
                "-b:v", bitrate,
                "-maxrate", bitrate,
                "-bufsize", String.valueOf(Integer.parseInt(bitrate.replace("k", "")) * 2) + "k",
                "-r", "30",
                "-g", "30",
                "-keyint_min", "30",
                "-sc_threshold", "0",
                "-c:a", "aac",
                "-b:a", "128k",
                "-ar", "44100",
                "-f", "hls",
                "-hls_time", "2",
                "-hls_list_size", "6",
                "-hls_flags", "delete_segments+append_list+program_date_time",
                "-hls_segment_type", "mpegts",
                "-hls_segment_filename", outputDir + "/segment_%d.ts",
                outputDir + "/index.m3u8"
        };
    }

    private void startOutputLogging(Process process, Long cameraId, StreamInfo streamInfo) {
        Thread logThread = new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                StringBuilder fullOutput = new StringBuilder();
                while (!Thread.currentThread().isInterrupted() && (line = reader.readLine()) != null) {
                    fullOutput.append(line).append("\n");

                    if (line.contains("error") || line.contains("Error") || line.contains("ERROR")) {
                        System.out.println("[FFmpeg-" + cameraId + " Error] " + line);
                        if (!streamInfo.isInitialized) {
                            streamInfo.lastError = line;
                            System.out.println("[FFmpeg Full Error]\n" + fullOutput);
                        }
                    } else {
                        if (line.contains("Opening") || line.contains("segment")) {
                            File outputDir = new File(getCameraDirectory(cameraId));
                            File[] segmentFiles = outputDir.listFiles((dir, name) -> name.endsWith(".ts"));
                            File[] playlistFiles = outputDir.listFiles((dir, name) -> name.endsWith(".m3u8"));

                            if ((segmentFiles != null && segmentFiles.length > 0) &&
                                    (playlistFiles != null && playlistFiles.length > 0)) {
                                System.out.println("[FFmpeg-" + cameraId + "] Files: " + segmentFiles.length
                                        + " segments, " + playlistFiles.length + " playlists");
                                streamInfo.isInitialized = true;
                            }
                        }
                    }
                }
            } catch (IOException e) {
                if (!runningStreams.containsKey(cameraId) || streamInfo.isShuttingDown) {
                    System.out.println("[FFmpeg-" + cameraId + "] Stream closed");
                } else {
                    System.out.println("[FFmpeg-" + cameraId + " Error] " + e.getMessage());
                    if (!streamInfo.isInitialized) {
                        streamInfo.lastError = e.getMessage();
                    }
                }
            }
        });
        logThread.setDaemon(true);
        logThread.start();
    }

    private void checkStreamHealth(Long cameraId, StreamInfo streamInfo) {
        if (!streamInfo.process.isAlive()) {
            System.out.println("[Health-" + cameraId + "] Stream died, attempting restart");
            if (streamInfo.restartAttempts < 3) {
                streamInfo.restartAttempts++;
                startStream(cameraId, streamInfo.quality);
            } else {
                System.out.println("[Health-" + cameraId + "] Failed after 3 attempts");
                stopStream(cameraId);
            }
        }
    }

    private void cleanOldSegments(Long cameraId) {
        try {
            Path directory = Paths.get(VIDEO_DIR, cameraId.toString());
            if (!Files.exists(directory))
                return;

            try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, "*.ts")) {
                for (Path file : stream) {
                    try {
                        BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
                        if (System.currentTimeMillis() - attrs.creationTime().toMillis() > 60000) {
                            Files.deleteIfExists(file);
                        }
                    } catch (IOException e) {
                        System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
        }
    }

    public void startStream(Long cameraId) {
        startStream(cameraId, "medium");
    }

    public void startStream(Long cameraId, String quality) {
        try {
            System.out.println("[Start-" + cameraId + "] Quality: " + quality);

            StreamInfo streamInfo = runningStreams.get(cameraId);
            if (streamInfo != null && streamInfo.process.isAlive()) {
                if (quality.equals(streamInfo.quality)) {
                    System.out.println("[Start-" + cameraId + "] Already running");
                    return;
                }
                System.out.println("[Start-" + cameraId + "] Quality changed, restarting");
                stopStream(cameraId);
            }

            Optional<Camera> camera = cameraRepository.findById(cameraId);
            if (camera.isEmpty()) {
                System.out.println("[Start-" + cameraId + "] Camera not found");
                throw new AppException(ErrorCode.DATA_NOT_FOUND);
            }

            createOutputDirectory(cameraId);
            Process process = startFFmpegProcess(camera.get(), cameraId, quality);
            StreamInfo newStreamInfo = new StreamInfo(process, quality);

            ScheduledFuture<?> healthCheck = scheduler.scheduleAtFixedRate(
                    () -> checkStreamHealth(cameraId, newStreamInfo),
                    5, 5, TimeUnit.SECONDS);

            ScheduledFuture<?> segmentCleaner = scheduler.scheduleAtFixedRate(
                    () -> cleanOldSegments(cameraId),
                    30, 30, TimeUnit.SECONDS);

            newStreamInfo.healthCheck = healthCheck;
            newStreamInfo.segmentCleaner = segmentCleaner;
            runningStreams.put(cameraId, newStreamInfo);

            startOutputLogging(process, cameraId, newStreamInfo);

            System.out.println("[Start-" + cameraId + "] Waiting for init...");
            int maxAttempts = 20;
            int attempt = 0;
            while (attempt < maxAttempts) {
                if (newStreamInfo.isInitialized) {
                    System.out.println("[Start-" + cameraId + "] Stream ready");
                    return;
                }
                if (newStreamInfo.lastError != null) {
                    System.out.println("[Start-" + cameraId + " Error] Init failed: " + newStreamInfo.lastError);
                    stopStream(cameraId);
                    throw new AppException(ErrorCode.INTERNAL_ERROR);
                }
                if (!process.isAlive()) {
                    System.out.println("[Start-" + cameraId + " Error] Process died during init");
                    stopStream(cameraId);
                    throw new AppException(ErrorCode.INTERNAL_ERROR);
                }
                Thread.sleep(500);
                attempt++;
            }

            System.out.println("[Start-" + cameraId + " Error] Init timeout");
            stopStream(cameraId);
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        } catch (Exception e) {
            System.out.println("[Start-" + cameraId + " Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public void stopStream(Long cameraId) {
        StreamInfo streamInfo = runningStreams.get(cameraId);
        if (streamInfo != null) {
            streamInfo.isShuttingDown = true;
            if (streamInfo.healthCheck != null) {
                streamInfo.healthCheck.cancel(true);
            }
            if (streamInfo.segmentCleaner != null) {
                streamInfo.segmentCleaner.cancel(true);
            }
            if (streamInfo.process != null && streamInfo.process.isAlive()) {
                streamInfo.process.destroy();
                try {
                    if (!streamInfo.process.waitFor(5, TimeUnit.SECONDS)) {
                        streamInfo.process.destroyForcibly();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    streamInfo.process.destroyForcibly();
                }
            }
            runningStreams.remove(cameraId);
            System.out.println("[Stop-" + cameraId + "] Stream stopped");
            cleanupAllSegments(cameraId);
        }
    }

    private void cleanupAllSegments(Long cameraId) {
        String cameraDir = getCameraDirectory(cameraId);
        try {
            File cameraDirFile = new File(cameraDir);
            if (cameraDirFile.exists()) {
                FileSystemUtils.deleteRecursively(cameraDirFile);
                if (!cameraDirFile.mkdirs()) {
                    throw new IOException("Failed to recreate: " + cameraDir);
                }
            }
            System.out.println("[Clean-" + cameraId + "] Segments cleaned");
        } catch (IOException e) {
            System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public boolean isStreaming(Long cameraId) {
        StreamInfo streamInfo = runningStreams.get(cameraId);
        return streamInfo != null && streamInfo.process.isAlive();
    }

    public String getStreamQuality(Long cameraId) {
        StreamInfo streamInfo = runningStreams.get(cameraId);
        return streamInfo != null ? streamInfo.quality : null;
    }

    public long getStreamUptime(Long cameraId) {
        StreamInfo streamInfo = runningStreams.get(cameraId);
        if (streamInfo != null && streamInfo.process.isAlive()) {
            return System.currentTimeMillis() - streamInfo.startTime;
        }
        return 0;
    }
}
