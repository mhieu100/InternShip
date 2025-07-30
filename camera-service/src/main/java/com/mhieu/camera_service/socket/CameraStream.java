package com.mhieu.camera_service.socket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import com.mhieu.camera_service.socket.StreamWebSocketHandler.ClientSession;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CameraStream {
    private final Long cameraId;
    private final String rtspUrl;
    private Process ffmpegProcess;
    private final Set<ClientSession> clients = ConcurrentHashMap.newKeySet();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread outputThread;

    @Getter
    private String status = "STOPPED";

    public CameraStream(Long cameraId, String rtspUrl) {
        this.cameraId = cameraId;
        this.rtspUrl = rtspUrl;
    }

    public synchronized void start() {
        if (running.get()) {
            log.info("Stream already running for camera {}", cameraId);
            return;
        }

        try {
            String[] command = {
                    "ffmpeg",
                    "-rtsp_transport", "tcp",
                    "-i", rtspUrl,
                    "-c:v", "mpeg1video",
                    "-f", "mpegts",
                    "-c:a", "mp2",
                    "-b:a", "128k",
                    "-s", "640x480", // scale video
                    "-q", "5", // quality (1-31, lower is better)
                    "-r", "30", // framerate
                    "-" // pipe output
            };

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            ffmpegProcess = pb.start();

            // Đọc output từ FFmpeg và gửi tới tất cả clients
            outputThread = new Thread(() -> {
                byte[] buffer = new byte[4096];
                int bytesRead;

                try {
                    while (running.get() &&
                            (bytesRead = ffmpegProcess.getInputStream().read(buffer)) != -1) {
                        if (bytesRead > 0) {
                            byte[] data = new byte[bytesRead];
                            System.arraycopy(buffer, 0, data, 0, bytesRead);
                            broadcast(data);
                        }
                    }
                } catch (IOException e) {
                    if (running.get()) {
                        log.error("Error reading FFmpeg output for camera {}: {}",
                                cameraId, e.getMessage());
                    }
                }
            });

            outputThread.setDaemon(true);
            running.set(true);
            outputThread.start();
            status = "STREAMING";

            // Theo dõi process FFmpeg
            new Thread(() -> {
                try {
                    int exitCode = ffmpegProcess.waitFor();
                    if (running.get()) {
                        log.error("FFmpeg process exited with code {} for camera {}",
                                exitCode, cameraId);
                        stop();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();

            log.info("Started streaming for camera {} with {} clients",
                    cameraId, clients.size());

        } catch (IOException e) {
            log.error("Failed to start streaming for camera {}: {}",
                    cameraId, e.getMessage());
            stop();
        }
    }

    public synchronized void stop() {
        if (!running.get()) {
            return;
        }

        running.set(false);

        if (ffmpegProcess != null) {
            ffmpegProcess.destroy();
            try {
                if (!ffmpegProcess.waitFor(5, java.util.concurrent.TimeUnit.SECONDS)) {
                    ffmpegProcess.destroyForcibly();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                ffmpegProcess.destroyForcibly();
            }
            ffmpegProcess = null;
        }

        if (outputThread != null) {
            outputThread.interrupt();
            outputThread = null;
        }

        status = "STOPPED";
        log.info("Stopped streaming for camera {}", cameraId);
    }

    public void addClient(ClientSession client) {
        clients.add(client);
        log.info("Added client to camera {}. Total clients: {}",
                cameraId, clients.size());

        if (!running.get()) {
            start();
        }
    }

    public void removeClient(ClientSession client) {
        clients.remove(client);
        log.info("Removed client from camera {}. Remaining clients: {}",
                cameraId, clients.size());

        if (clients.isEmpty()) {
            stop();
        }
    }

    private void broadcast(byte[] data) {
        // Tạo một bản sao của set clients để tránh ConcurrentModificationException
        Set<ClientSession> currentClients = Set.copyOf(clients);

        for (ClientSession client : currentClients) {
            try {
                if (client.isOpen()) {
                    client.send(data);
                } else {
                    // Remove closed sessions
                    clients.remove(client);
                }
            } catch (Exception e) {
                log.debug("Error sending data to client for camera {}: {}",
                        cameraId, e.getMessage());
                clients.remove(client);
            }
        }
    }

    public boolean hasClients() {
        return !clients.isEmpty();
    }

    public int getClientCount() {
        return clients.size();
    }
}
