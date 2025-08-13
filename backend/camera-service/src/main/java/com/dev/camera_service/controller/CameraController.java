package com.dev.camera_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.camera_service.anotation.Message;
import com.dev.camera_service.dto.request.CameraRequest;
import com.dev.camera_service.dto.response.CameraResponse;
import com.dev.camera_service.dto.response.Pagination;
import com.dev.camera_service.exception.AppException;
import com.dev.camera_service.model.Camera;
import com.dev.camera_service.service.CameraService;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class CameraController {

    private final CameraService cameraService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Message("create new camera")
    public ResponseEntity<CameraResponse> createCamera(@Valid @RequestBody CameraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cameraService.createCamera(request));
    }

    @GetMapping("/public")
    @Message("get all public cameras")
    public ResponseEntity<Pagination> getPublicCameras(@Filter Specification<Camera> specification, Pageable pageable) {

        specification = Specification.where(specification).and((root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get("isPublic"), true));
        return ResponseEntity.status(HttpStatus.OK).body(cameraService.getPublicCameras(specification, pageable));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Message("get all cameras")
    public ResponseEntity<Pagination> getCameras(@Filter Specification<Camera> specification, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(cameraService.getAllCameras(specification, pageable));
    }

    @GetMapping("/{id}")
    @Message("get camera by id")
    public ResponseEntity<CameraResponse> getCameraById(@PathVariable("id") long id) throws AppException {
        return ResponseEntity.status(HttpStatus.OK).body(this.cameraService.getCamera(id));
    }

    @PutMapping("/{id}")
    @Message("update camera")
    public ResponseEntity<CameraResponse> update(@PathVariable long id, @Valid @RequestBody CameraRequest request)
            throws AppException {
        return ResponseEntity.status(HttpStatus.OK).body(this.cameraService.updateCamera(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Message("delete camera")
    public ResponseEntity<Void> delete(@PathVariable long id) throws AppException {
        this.cameraService.deleteCamera(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
