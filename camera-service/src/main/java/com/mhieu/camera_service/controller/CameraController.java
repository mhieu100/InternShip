package com.mhieu.camera_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mhieu.camera_service.annotation.ApiMessage;
import com.mhieu.camera_service.dto.request.CameraRequest;
import com.mhieu.camera_service.dto.response.CameraResponse;
import com.mhieu.camera_service.dto.response.PaginationResponse;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.service.CameraService;
import com.mhieu.camera_service.service.StreamService;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
@Validated
public class CameraController {

    private final CameraService cameraService;
    private final StreamService streamService;

    private static final String BASE_PATH = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos/";

    @PostMapping
    @ApiMessage("create new camera")
    public ResponseEntity<CameraResponse> createCamera(@Valid @RequestBody CameraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cameraService.createCamera(request));
    }

    @GetMapping("/{id}")
    @ApiMessage("get camera by id")
    public ResponseEntity<CameraResponse> getCameraById(@PathVariable Long id) {
        return ResponseEntity.ok(cameraService.getCameraById(id));
    }

    @GetMapping
    @ApiMessage("get all cameras")
    public ResponseEntity<PaginationResponse> getAllCameras(@Filter Specification<Camera> specification,
            Pageable pageable) {
        return ResponseEntity.ok(cameraService.getAllCameras(specification, pageable));
    }

    @PutMapping("/{id}")
    @ApiMessage("update camera")
    public ResponseEntity<CameraResponse> updateCamera(@PathVariable Long id,
            @Valid @RequestBody CameraRequest request) {
        return ResponseEntity.ok(cameraService.updateCamera(id, request));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("delete camera")
    public ResponseEntity<Void> deleteCamera(@PathVariable Long id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.noContent().build();
    }

    
}