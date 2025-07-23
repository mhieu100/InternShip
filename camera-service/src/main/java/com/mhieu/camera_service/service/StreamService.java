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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(StreamService.class);
    private static final String BASE_DIR = "/home/mhieu/Coding/GitHub/exercise/camera-service";
    private static final String VIDEO_DIR = BASE_DIR + "/videos";
    private static final String TEMP_DIR = VIDEO_DIR + "/temp";

    private static final String VIDEO_DIR = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos/";
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
            // Ensure base directories exist with correct permissions
            createDirectoryWithPermissions(VIDEO_DIR);
            createDirectoryWithPermissions(TEMP_DIR);

            // Clean any existing streams
            cleanAllStreams();

            logger.info("Stream service initialized successfully");
        } catch (IOException e) {
            logger.error("Failed to initialize stream service", e);
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    private void createDirectoryWithPermissions(String path) throws IOException {
        File dir = new File(path);
        if (!dir.exists()) {
            logger.info("Creating directory: {}", path);
            if (!dir.mkdirs()) {
                throw new IOException("Failed to create directory: " + path);
            }
        }

        // Ensure directory is writable
        if (!dir.canWrite()) {
            logger.warn("Directory not writable, attempting to set permissions: {}", path);
            if (!dir.setWritable(true, false)) {
                throw new IOException("Failed to set write permissions on directory: " + path);
            }
        }

        logger.info("Directory ready: {}", path);
    }

    private void cleanAllStreams() {
        try {
            File videoDir = new File(VIDEO_DIR);
            File[] cameraDirs = videoDir.listFiles(File::isDirectory);
            if (cameraDirs != null) {
                for (File dir : cameraDirs) {
                    if (!dir.getName().equals("temp")) {
                        logger.info("Cleaning up old stream directory: {}", dir.getPath());
                        FileSystemUtils.deleteRecursively(dir);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Failed to clean old streams", e);
        }
        logger.info("All streams cleaned");
    }

    private String getCameraDirectory(Long cameraId) {
        return VIDEO_DIR + "/" + cameraId;
    }

    private String getTempDirectory(Long cameraId) {
        return TEMP_DIR + "/" + cameraId;
    }

    private void createOutputDirectory(Long cameraId) throws IOException {
        String cameraDir = getCameraDirectory(cameraId);
        String tempDir = getTempDirectory(cameraId);

        // Create both directories with full permissions
        createDirectoryWithPermissions(cameraDir);
        createDirectoryWithPermissions(tempDir);

        // Clean any existing files
        cleanupAllSegments(cameraId);

        logger.info("Created and prepared directories: camera={}, temp={}", cameraDir, tempDir);
    }

    private Process startFFmpegProcess(Camera camera, Long cameraId, String quality) {
        String[] command = buildFFmpegCommand(camera, quality);
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);

        logger.info("Starting FFmpeg with command: {}", String.join(" ", command));

        try {
            String cameraDir = getCameraDirectory(cameraId);
            String tempDir = getTempDirectory(cameraId);

            // Set working directory to temp
            processBuilder.directory(new File(tempDir));
            logger.info("Working directory set to: {}", tempDir);

            // Start FFmpeg process
            Process process = processBuilder.start();
            logger.info("FFmpeg process started for camera {} in directory {}", cameraId, tempDir);

            // Check process immediately
            try {
                Thread.sleep(1000);
                int exitValue = process.exitValue();
                logger.error("FFmpeg process exited immediately with code {}", exitValue);

                // Get the error output
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    StringBuilder error = new StringBuilder();
                    while ((line = reader.readLine()) != null) {
                        error.append(line).append("\n");
                    }
                    logger.error("FFmpeg error output:\n{}", error.toString());
                }

                throw new AppException(ErrorCode.INTERNAL_ERROR);
            } catch (IllegalThreadStateException e) {
                logger.info("FFmpeg process is running");
            }

            return process;
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to start FFmpeg process for camera {}: {}", cameraId, e.getMessage());
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
        String tempDir = getTempDirectory(camera.getId());

        logger.info("Setting up FFmpeg command with output directory: {}", outputDir);

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
                "-hls_segment_filename", tempDir + "/segment_%d.ts",
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
                        logger.error("[FFmpeg-{}] {}", cameraId, line);
                        if (!streamInfo.isInitialized) {
                            streamInfo.lastError = line;
                            // Log full output for context
                            logger.error("Full FFmpeg output until error:\n{}", fullOutput.toString());
                        }
                    } else {
                        logger.info("[FFmpeg-{}] {}", cameraId, line);
                        // Check for successful initialization
                        if (line.contains("Opening") || line.contains("segment")) {
                            // Verify files are being created in both directories
                            File tempDir = new File(getTempDirectory(cameraId));
                            File outputDir = new File(getCameraDirectory(cameraId));

                            File[] tempFiles = tempDir.listFiles((dir, name) -> name.endsWith(".ts"));
                            File[] outputFiles = outputDir.listFiles((dir, name) -> name.endsWith(".m3u8"));

                            if ((tempFiles != null && tempFiles.length > 0) ||
                                    (outputFiles != null && outputFiles.length > 0)) {
                                logger.info("Found {} segment files and {} playlist files",
                                        tempFiles != null ? tempFiles.length : 0,
                                        outputFiles != null ? outputFiles.length : 0);
                                streamInfo.isInitialized = true;
                            } else {
                                logger.warn("No output files found yet in temp: {} or output: {}",
                                        tempDir.getAbsolutePath(),
                                        outputDir.getAbsolutePath());
                            }
                        }
                    }
                }
            } catch (IOException e) {
                if (!runningStreams.containsKey(cameraId) ||
                        streamInfo.isShuttingDown) {
                    logger.debug("Stream closed for camera {}", cameraId);
                } else {
                    logger.error("Error reading FFmpeg output for camera {}: {}", cameraId, e.getMessage());
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
            logger.warn("Stream died for camera {}. Attempting restart...", cameraId);
            if (streamInfo.restartAttempts < 3) {
                streamInfo.restartAttempts++;
                startStream(cameraId, streamInfo.quality);
            } else {
                logger.error("Stream failed to restart after 3 attempts for camera {}", cameraId);
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
                        // Delete segments older than 1 minute
                        if (System.currentTimeMillis() - attrs.creationTime().toMillis() > 60000) {
                            Files.deleteIfExists(file);
                        }
                    } catch (IOException e) {
                        logger.warn("Failed to check/delete old segment: {}", file, e);
                    }
                }
            }
        } catch (IOException e) {
            logger.error("Error cleaning old segments for camera {}", cameraId, e);
        }
    }

    public void startStream(Long cameraId) {
        startStream(cameraId, "medium");
    }

    public void startStream(Long cameraId, String quality) {
        try {
            logger.info("Starting stream for camera {} with quality {}", cameraId, quality);

            StreamInfo streamInfo = runningStreams.get(cameraId);
            if (streamInfo != null && streamInfo.process.isAlive()) {
                if (quality.equals(streamInfo.quality)) {
                    logger.info("Stream already running for camera {} with quality {}", cameraId, quality);
                    return;
                }
                logger.info("Quality changed, restarting stream");
                stopStream(cameraId);
            }

            Optional<Camera> camera = cameraRepository.findById(cameraId);
            if (camera.isEmpty()) {
                logger.error("Camera not found: {}", cameraId);
                throw new AppException(ErrorCode.DATA_NOT_FOUND);
            }
            logger.info("Found camera: {}", camera.get().getIpAddress());

            try {
                createOutputDirectory(cameraId);
            } catch (Exception e) {
                logger.error("Failed to create output directory for camera {}: {}", cameraId, e.getMessage());
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            Process process;
            try {
                process = startFFmpegProcess(camera.get(), cameraId, quality);
            } catch (Exception e) {
                logger.error("Failed to start FFmpeg process for camera {}: {}", cameraId, e.getMessage());
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            StreamInfo newStreamInfo = new StreamInfo(process, quality);

            // Setup health check
            ScheduledFuture<?> healthCheck = scheduler.scheduleAtFixedRate(
                    () -> checkStreamHealth(cameraId, newStreamInfo),
                    5,
                    5,
                    TimeUnit.SECONDS);

            // Setup segment cleaner
            ScheduledFuture<?> segmentCleaner = scheduler.scheduleAtFixedRate(
                    () -> cleanOldSegments(cameraId),
                    30,
                    30,
                    TimeUnit.SECONDS);

            newStreamInfo.healthCheck = healthCheck;
            newStreamInfo.segmentCleaner = segmentCleaner;
            runningStreams.put(cameraId, newStreamInfo);

            // Start output logging and wait for initialization
            startOutputLogging(process, cameraId, newStreamInfo);

            // Wait for stream to initialize or error
            logger.info("Waiting for stream to initialize...");
            int maxAttempts = 20;
            int attempt = 0;
            while (attempt < maxAttempts) {
                if (newStreamInfo.isInitialized) {
                    logger.info("Stream initialized successfully for camera {}", cameraId);
                    return;
                }
                if (newStreamInfo.lastError != null) {
                    logger.error("Stream initialization failed with error: {}", newStreamInfo.lastError);
                    stopStream(cameraId);
                    throw new AppException(ErrorCode.INTERNAL_ERROR);
                }
                if (!process.isAlive()) {
                    logger.error("FFmpeg process died during initialization");
                    stopStream(cameraId);
                    throw new AppException(ErrorCode.INTERNAL_ERROR);
                }
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    logger.error("Stream initialization interrupted");
                    Thread.currentThread().interrupt();
                    stopStream(cameraId);
                    throw new AppException(ErrorCode.INTERNAL_ERROR);
                }
                attempt++;
                logger.debug("Waiting for stream initialization, attempt {}/{}", attempt, maxAttempts);
            }

            logger.error("Stream initialization timed out after {} attempts", maxAttempts);
            stopStream(cameraId);
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        } catch (Exception e) {
            logger.error("Unexpected error starting stream for camera {}: {}", cameraId, e.getMessage(), e);
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
                    // Wait for process to terminate gracefully
                    if (!streamInfo.process.waitFor(5, TimeUnit.SECONDS)) {
                        streamInfo.process.destroyForcibly();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    streamInfo.process.destroyForcibly();
                }
            }
            runningStreams.remove(cameraId);
            logger.info("Stream stopped for camera {}", cameraId);

            // Cleanup HLS segments
            cleanupAllSegments(cameraId);
        }
    }

    private void cleanupAllSegments(Long cameraId) {
        String cameraDir = getCameraDirectory(cameraId);
        String tempDir = getTempDirectory(cameraId);

        try {
            // Clean camera directory
            File cameraDirFile = new File(cameraDir);
            if (cameraDirFile.exists()) {
                FileSystemUtils.deleteRecursively(cameraDirFile);
                if (!cameraDirFile.mkdirs()) {
                    throw new IOException("Failed to recreate camera directory: " + cameraDir);
                }
            }

            // Clean temp directory
            File tempDirFile = new File(tempDir);
            if (tempDirFile.exists()) {
                FileSystemUtils.deleteRecursively(tempDirFile);
                if (!tempDirFile.mkdirs()) {
                    throw new IOException("Failed to recreate temp directory: " + tempDir);
                }
            }

            logger.info("Cleaned up all segments for camera {} in both directories", cameraId);
        } catch (IOException e) {
            logger.error("Failed to clean up segments for camera {}: {}", cameraId, e.getMessage());
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
