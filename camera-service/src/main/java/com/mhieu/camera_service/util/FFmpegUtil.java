package com.mhieu.camera_service.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.stereotype.Component;

import com.mhieu.camera_service.dto.request.UpdateStatusCameraRequest;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.repository.CameraRepository;
import com.mhieu.camera_service.service.CameraService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FFmpegUtil {

    private final CameraService cameraService;
    private final CameraRepository cameraRepository;

    public List<Camera> checkAllStreamURLActive() {
        List<Camera> cameras = cameraRepository.findAll();

        int threadPoolSize = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadPoolSize);
        for (Camera camera : cameras) {
            executor.submit(() -> checkStream(camera));
        }

        executor.shutdown();
        return cameras;
    }

    private void checkStream(Camera camera) {
        try {
            // 1. Command kiểm tra codec (giữ nguyên)
            String[] codecCommand = {
                    "ffprobe", "-v", "error",
                    "-rtsp_transport", "tcp",
                    "-i", camera.getStreamUrl(),
                    "-show_entries", "stream=codec_name",
                    "-of", "default=noprint_wrappers=1:nokey=1"
            };

            // 2. Command lấy thông tin video stream
            String[] videoInfoCommand = {
                    "ffprobe", "-v", "error",
                    "-select_streams", "v:0",
                    "-show_entries", "stream=width,height,avg_frame_rate",
                    "-of", "csv=p=0:nk=1",
                    camera.getStreamUrl()
            };

            // Kiểm tra codec
            boolean streamIsActive = checkCodec(codecCommand);

            String fps = null;
            String resolution = null;

            if (streamIsActive) {
                // Lấy thông tin video stream
                ProcessBuilder pbVideo = new ProcessBuilder(videoInfoCommand);
                Process processVideo = pbVideo.start();

                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(processVideo.getInputStream()))) {

                    String videoInfo = reader.readLine();
                    if (videoInfo != null && !videoInfo.trim().isEmpty()) {
                        // Format: "width,height,avg_frame_rate" (ví dụ: "1920,1080,30/1")
                        String[] parts = videoInfo.split(",");
                        if (parts.length == 3) {
                            // Xử lý resolution (phần tử 0 và 1)
                            resolution = parts[0] + "x" + parts[1];

                            // Xử lý FPS (phần tử 2)
                            fps = parseFps(parts[2]);
                        }
                    }
                }
                processVideo.waitFor();
            }

            // Cập nhật trạng thái
            cameraService.updateStatusCamera(camera.getId(),
                    UpdateStatusCameraRequest.builder()
                            .status(streamIsActive ? Camera.Status.ONLINE : Camera.Status.OFFLINE)
                            .fps(fps)
                            .resolution(resolution)
                            .build());

        } catch (Exception e) {
            System.out.println("Error checking stream: " + camera.getStreamUrl() + " | " + e.getMessage());
        }
    }

    private boolean checkCodec(String[] command) throws Exception {
        Process process = new ProcessBuilder(command).start();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("h264") || line.contains("aac")) {
                    return true;
                }
            }
        }
        return process.waitFor() == 0;
    }

    private String parseFps(String fpsFraction) {
        if (fpsFraction == null || fpsFraction.isEmpty()) {
            return null;
        }

        try {
            if (fpsFraction.contains("/")) {
                String[] parts = fpsFraction.split("/");
                double numerator = Double.parseDouble(parts[0]);
                double denominator = Double.parseDouble(parts[1]);
                if (denominator != 0) {
                    return String.valueOf((int) Math.round(numerator / denominator));
                }
            }
            return fpsFraction; // Trả về nguyên bản nếu không parse được
        } catch (NumberFormatException e) {
            return fpsFraction;
        }
    }

    public long checkRtspPing(String rtspUrl) {
        Instant start = Instant.now();
        try {
            String[] command = {
                    "ffmpeg",
                    "-rtsp_transport", "tcp",
                    "-i", rtspUrl,
                    "-vframes", "1",
                    "-f", "null", "-",
                    "-y",
                    "-timeout", "3000000"
            };

            Process process = Runtime.getRuntime().exec(command);

            BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()));
            while (errorReader.readLine() != null)
                ;

            int exitCode = process.waitFor();
            if (exitCode != 0)
                return -1; // Kết nối thất bại

            return Duration.between(start, Instant.now()).toMillis();
        } catch (Exception e) {
            return -1;
        }
    }

    public String takePicture(String rtspUrl) {
        Instant time = Instant.now();
        String outputFile = time + "-" +rtspUrl+ ".png";
        try {
            String[] command = {
            "ffmpeg",
            "-y",                 
            "-i", rtspUrl,         
            "-vframes", "1",        
            "-q:v", "2",           
            outputFile
            };
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.redirectErrorStream(true); // Gộp stderr và stdout

       
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return outputFile;
            } else {
                return null;
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }
}
