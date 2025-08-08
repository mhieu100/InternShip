package com.mhieu.camera_service.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mhieu.camera_service.annotation.ApiMessage;
import com.mhieu.camera_service.dto.response.HealthyResponse;
import com.mhieu.camera_service.dto.response.PictureResponse;
import com.mhieu.camera_service.model.CheckHistory;
import com.mhieu.camera_service.service.HealthService;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Validated
public class HealthyController {

    private final HealthService healthService;

    @GetMapping("/{id}")
    @ApiMessage("check camera health")
    public ResponseEntity<HealthyResponse> healthCamera(@PathVariable("id") Long id) {
        return ResponseEntity.ok(healthService.checkHealthCamera(id));
    }

    @PostMapping("/history")
    @ApiMessage("save history check camera")
    public ResponseEntity<HealthyResponse> saveCameraHistory(@RequestBody CheckHistory checkHistory) {
        return ResponseEntity.ok(healthService.saveHistory(checkHistory));
    }

    @GetMapping("/history")
    @ApiMessage("get history check camera")
    public ResponseEntity<List<HealthyResponse>> getHistoryCheck() {
        return ResponseEntity.ok(healthService.getHistoryCheck());
    }

    @PostMapping("/{id}/screen-shot")
    @ApiMessage("take a screenshot of the camera")
    public ResponseEntity<PictureResponse> screenShot(@PathVariable("id") Long cameraId) {
        return ResponseEntity.ok(healthService.screenShot(cameraId));
    }

}
