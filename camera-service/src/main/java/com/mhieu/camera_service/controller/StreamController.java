package com.mhieu.camera_service.controller;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.mhieu.camera_service.service.StreamService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
public class StreamController {

    private static final String BASE_PATH = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos/";
    private final StreamService streamService;

    @GetMapping("/{id}/**")
    public ResponseEntity<?> serveFile(HttpServletRequest request, @PathVariable("id") Long id) {
        try {
            streamService.startStream(id);
            String reqPath = request.getRequestURI(); // ví dụ: /index.m3u8, /index0.ts
            Path filePath = Paths.get(BASE_PATH + reqPath).normalize();
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                File notFoundPage = new File("./404.html");
                if (notFoundPage.exists()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)

                            .contentType(MediaType.TEXT_HTML)
                            .body(new FileSystemResource(notFoundPage));
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(null);
                }
            }

            FileSystemResource resource = new FileSystemResource(file);

            MediaType contentType = getContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    private MediaType getContentType(Path filePath) {
        String name = filePath.getFileName().toString().toLowerCase();
        if (name.endsWith(".m3u8"))
            return MediaType.valueOf("application/vnd.apple.mpegurl");
        if (name.endsWith(".ts"))
            return MediaType.valueOf("video/mp2t");
        if (name.endsWith(".html"))
            return MediaType.TEXT_HTML;
        return MediaType.APPLICATION_OCTET_STREAM;
    }


    @GetMapping("/destroy/{id}")
    public void destroy(@PathVariable("id") Long id) {
        streamService.stopStream(id);
    }
}
