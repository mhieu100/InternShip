package com.dev.stream_service.utils;
import com.dev.stream_service.dto.request.UpdateStatusRequest;
import com.dev.stream_service.dto.response.CameraResponse;
import com.dev.stream_service.service.httpClient.CameraClient;
import com.dev.stream_service.socket.StreamWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
public class FFmpegUtil {

    private final StreamWebSocketHandler streamHandler;
    private  final CameraClient cameraClient;
    private static String baseURI = "file:///home/mhieu/Coding/exercise/camera-service/src/main/resources/static/";

    public List<CameraResponse> checkAllStreamURLActive() {
        List<CameraResponse> cameras = cameraClient.getAllCamerasForStream().getData();

        ExecutorService executor = Executors.newFixedThreadPool(10);

        List<CameraResponse> immediateResponse = new ArrayList<>(cameras);

        for (CameraResponse camera : cameras) {
            executor.execute(() -> {
                CameraResponse updatedCamera = checkStream(camera);
                int index = cameras.indexOf(camera);
                if (index != -1) {
                    immediateResponse.set(index, updatedCamera);
                }
            });
        }
        executor.shutdown();
        return cameras;
    }

    private CameraResponse checkStream(CameraResponse camera) {
        try {
            String[] codecCommand = {
                    "ffprobe", "-v", "error",
                    "-rtsp_transport", "tcp",
                    "-i", camera.getStreamUrl(),
                    "-show_entries", "stream=codec_name",
                    "-of", "default=noprint_wrappers=1:nokey=1"
            };

            String[] videoInfoCommand = {
                    "ffprobe", "-v", "error",
                    "-select_streams", "v:0",
                    "-show_entries", "stream=width,height,avg_frame_rate",
                    "-of", "csv=p=0:nk=1",
                    camera.getStreamUrl()
            };

            boolean streamIsActive = checkCodec(codecCommand);
            CameraResponse.Status newStatus = streamIsActive ? CameraResponse.Status.ONLINE : CameraResponse.Status.OFFLINE;

            String fps = null;
            String resolution = null;

            if (streamIsActive) {
                ProcessBuilder pbVideo = new ProcessBuilder(videoInfoCommand);
                Process processVideo = pbVideo.start();

                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(processVideo.getInputStream()))) {

                    String videoInfo = reader.readLine();
                    if (videoInfo != null && !videoInfo.trim().isEmpty()) {
                        String[] parts = videoInfo.split(",");
                        if (parts.length == 3) {
                            resolution = parts[0] + "x" + parts[1];
                            fps = parseFps(parts[2]);
                        }
                    }
                }
                processVideo.waitFor();
            }

            // Get real-time viewer count from StreamWebSocketHandler
            int viewerCount = streamHandler.getViewerCount(camera.getId());

            // If camera is offline, force viewer count to 0
            if (newStatus == CameraResponse.Status.OFFLINE) {
                viewerCount = 0;
            }

            // Update camera status with synchronized viewer count
            cameraClient.updateStatusCamera(camera.getId(),
                    UpdateStatusRequest.builder()
                            .status(newStatus)
                            .fps(fps)
                            .resolution(resolution)
                            .viewerCount(viewerCount)
                            .build());

            // Update the camera object for health check response
            camera.setStatus(newStatus);
            camera.setViewerCount(viewerCount);
            camera.setFps(fps);
            camera.setResolution(resolution);



        } catch (Exception e) {
            System.out.println("Error checking stream: " + camera.getStreamUrl() + " | " + e.getMessage());
            // Set camera as offline on error
            try {
                cameraClient.updateStatusCamera(camera.getId(),
                        UpdateStatusRequest.builder()
                                .status(CameraResponse.Status.OFFLINE)
                                .viewerCount(0)
                                .build());
                camera.setStatus(CameraResponse.Status.OFFLINE);
                camera.setViewerCount(0);


            } catch (Exception updateError) {
                System.out.println("Error updating camera status: " + updateError.getMessage());
            }
        }
        return camera;
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
            return fpsFraction;
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
        System.out.println(baseURI);
        String cleanBaseUri = baseURI.replace("file://", "");
        Path basePath = Paths.get(cleanBaseUri).normalize();

        Path snapshotsDir = basePath.resolve("snapshots");
        try {
            Files.createDirectories(snapshotsDir);
        } catch (IOException e) {
            System.err.println("❌ Failed to create snapshots directory: " + e.getMessage());
            return null;
        }
        Instant time = Instant.now();
        String safeRtspName = rtspUrl.replaceAll("[:/]", "_");
        String outputFile = "snapshot-" + time.toEpochMilli() + "-" + safeRtspName + ".png";
        String outputPath = snapshotsDir.resolve(outputFile).toString();
        try {
            String[] command = {
                    "ffmpeg",
                    "-y",
                    "-i", rtspUrl,
                    "-vframes", "1",
                    "-q:v", "2",
                    outputPath.toString()
            };
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.redirectErrorStream(true); // Merge stderr with stdout

            Process process = builder.start();

            // Đọc log ffmpeg
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[ffmpeg] " + line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("✅ Snapshot created: " + outputFile);
                return outputFile;
            } else {
                System.err.println("❌ FFmpeg failed with exit code: " + exitCode);
                return null;
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return null;
    }
}
