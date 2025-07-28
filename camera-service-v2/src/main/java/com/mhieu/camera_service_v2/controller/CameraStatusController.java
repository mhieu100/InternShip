package com.mhieu.camera_service_v2.controller;

import java.io.ObjectInputFilter.Status;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.mhieu.camera_service_v2.config.CameraStream;
import com.mhieu.camera_service_v2.config.StreamWebSocketHandler;
import com.mhieu.camera_service_v2.dto.StatusResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CameraStatusController {
    private final StreamWebSocketHandler streamWebSocketHandler;

    @GetMapping("/api/cameras/{cameraId}/status")
    public ResponseEntity<StatusResponse> checkCameraStatus(@PathVariable("cameraId") Long cameraId) {
        CameraStream stream = streamWebSocketHandler.getActiveStreams().get(cameraId);
        String status = (stream != null && stream.hasClients()) ? stream.getStatus() : "OFFLINE";
        return ResponseEntity.ok(StatusResponse.builder()
                .status(status)
                .timestamp(Instant.now())
                .build());
    }
}
