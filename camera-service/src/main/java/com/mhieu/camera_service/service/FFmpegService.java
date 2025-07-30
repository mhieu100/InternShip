package com.mhieu.camera_service.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;
import com.mhieu.camera_service.model.Camera;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FFmpegService {

    private final OutputFolder outputFolder;

    public Process startFFmpegProcess(Camera camera, Long cameraId, String quality) {
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

        String outputDir = outputFolder.getCameraDirectory(camera.getId());
        System.out.println("[FFmpeg] Output: " + outputDir);

        return new String[] {
                "ffmpeg",
                "-rtsp_transport", "tcp",
                "-i", camera.getStreamUrl(),
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
}
