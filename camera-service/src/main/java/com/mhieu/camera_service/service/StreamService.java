package com.mhieu.camera_service.service;

import java.io.*;
import java.util.Map;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.repository.CameraRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {

    private static final String VIDEO_DIR = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos/";
    private static final long FILE_AGE_THRESHOLD_MS = 30 * 1000;
    private final CameraRepository cameraRepository;
    private final Map<Long, Process> runningStreams = new ConcurrentHashMap<>();

    public void startStream(Long cameraId) {
        if (runningStreams.containsKey(cameraId))
            return;

        Optional<Camera> camera = cameraRepository.findById(cameraId);

        if (camera.isEmpty()) {
            throw new AppException(ErrorCode.DATA_NOT_FOUND);
        }

        File outputDir = new File(VIDEO_DIR + cameraId);
        if (!outputDir.exists()) {
            boolean created = outputDir.mkdirs();
            if (!created) {
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }
        }

        String[] command = {
                "ffmpeg",
                "-rtsp_transport", "tcp",
                "-i", camera.get().getIpAddress(),

                // Tối ưu phân tích và giảm delay
                "-fflags", "nobuffer",
                "-flags", "low_delay",
                "-strict", "experimental",
                "-fflags", "+genpts+discardcorrupt",
                "-flush_packets", "1",
                "-probesize", "32",
                "-analyzeduration", "0",
                "-max_delay", "150000",

                // HLS settings
                "-hls_time", "1", // phân mảnh nhỏ hơn để có segment sớm hơn
                "-hls_list_size", "3",
                "-hls_flags", "delete_segments", // giữ HLS playlist ngắn gọn và nhẹ
                "-hls_allow_cache", "0",

                "-vcodec", "copy",
                "-y",
                VIDEO_DIR + camera.get().getId() + "/index.m3u8"
        };

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);

        try {
            Process process = processBuilder.start();
            runningStreams.put(cameraId, process);
            new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[FFmpeg-" + cameraId + "] " + line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void stopStream(Long cameraId) {
        Process process = runningStreams.get(cameraId);
        if (process != null && process.isAlive()) {
            process.destroy(); // hoặc destroyForcibly()
            runningStreams.remove(cameraId);
            System.out.println("Stopped stream for camera: " + cameraId);
        }
    }

    public boolean isStreaming(Long cameraId) {
        Process process = runningStreams.get(cameraId);
        return process != null && process.isAlive();
    }

}
