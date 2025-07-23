package com.mhieu.camera_service.controller;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mhieu.camera_service.service.StreamService;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.AllArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stream")
public class StreamController {
    private static final Logger logger = LoggerFactory.getLogger(StreamController.class);
    private static final String BASE_PATH = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos/";
    private final StreamService streamService;

    @PostMapping("/{id}/start")
    public ResponseEntity<String> startStream(
            @PathVariable("id") Long id,
            @RequestParam(required = false, defaultValue = "medium") String quality) {
        try {
            streamService.startStream(id, quality);
            return ResponseEntity.ok("Stream started successfully");
        } catch (Exception e) {
            logger.error("Failed to start stream for camera {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to start stream: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<StreamStatus> getStreamStatus(@PathVariable("id") Long id) {
        StreamStatus status = new StreamStatus(
                streamService.isStreaming(id),
                streamService.getStreamQuality(id),
                streamService.getStreamUptime(id));
        return ResponseEntity.ok(status);
    }

    @GetMapping("/{id}/{filename}")
    public ResponseEntity<?> serveFile(
            @PathVariable("id") Long id,
            @PathVariable("filename") String filename) {
        try {
            if (!streamService.isStreaming(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Stream is not active for camera " + id);
            }

            Path filePath = Paths.get(BASE_PATH, String.valueOf(id), filename).normalize();

            // Security check - ensure the path is within the allowed directory
            if (!filePath.startsWith(BASE_PATH)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied");
            }

            File file = filePath.toFile();
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Resource not found");
            }

            FileSystemResource resource = new FileSystemResource(file);
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(resource);

        } catch (Exception e) {
            logger.error("Error serving stream file for camera {}: {}", id, filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error");
        }
    }

    @DeleteMapping("/{id}/stop")
    public ResponseEntity<String> stopStream(@PathVariable("id") Long id) {
        try {
            if (!streamService.isStreaming(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No active stream found for camera " + id);
            }
            streamService.stopStream(id);
            return ResponseEntity.ok("Stream stopped successfully");
        } catch (Exception e) {
            logger.error("Failed to stop stream for camera {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to stop stream: " + e.getMessage());
        }
    }

    private MediaType getContentType(Path filePath) {
        String name = filePath.getFileName().toString().toLowerCase();
        if (name.endsWith(".m3u8")) {
            return MediaType.valueOf("application/vnd.apple.mpegurl");
        }
        if (name.endsWith(".ts")) {
            return MediaType.valueOf("video/mp2t");
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    @Getter
    @AllArgsConstructor
    public static class StreamStatus {
        @JsonProperty("active")
        private final boolean active;

        @JsonProperty("quality")
        private final String quality;

        @JsonProperty("uptimeMs")
        private final long uptimeMs;

    @GetMapping("/destroy/{id}")
    public void destroy(@PathVariable("id") Long id) {
        streamService.stopStream(id);
    }
}
