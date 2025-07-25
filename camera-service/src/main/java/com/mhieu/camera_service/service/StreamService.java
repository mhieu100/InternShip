package com.mhieu.camera_service.service;

import java.io.*;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.repository.CameraRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {

    private final CameraRepository cameraRepository;
    private final Map<Long, StreamInfo> runningStreams = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final OutputFolder outputFolder;
    private final FFmpegService ffmpegService;

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
                            File outputDir = new File(outputFolder.getCameraDirectory(cameraId));
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

            outputFolder.createOutputDirectory(cameraId);
            Process process = ffmpegService.startFFmpegProcess(camera.get(), cameraId, quality);
            StreamInfo newStreamInfo = new StreamInfo(process, quality);

            ScheduledFuture<?> healthCheck = scheduler.scheduleAtFixedRate(
                    () -> checkStreamHealth(cameraId, newStreamInfo),
                    5, 5, TimeUnit.SECONDS);

            ScheduledFuture<?> segmentCleaner = scheduler.scheduleAtFixedRate(
                    () -> outputFolder.cleanOldSegments(cameraId),
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
            outputFolder.cleanupAllSegments(cameraId);
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
