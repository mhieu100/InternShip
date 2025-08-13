package com.dev.camera_service.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.dev.camera_service.dto.request.CameraRequest;
import com.dev.camera_service.dto.response.CameraResponse;
import com.dev.camera_service.dto.response.Pagination;
import com.dev.camera_service.exception.AppException;
import com.dev.camera_service.exception.ErrorCode;
import com.dev.camera_service.model.Camera;
import com.dev.camera_service.repository.CameraRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CameraService {
    private final CameraRepository cameraRepository;

    public CameraResponse toResponse(Camera camera) {
        return CameraResponse.builder()
                .id(camera.getId())
                .name(camera.getName())
                .type(camera.getType())
                .streamUrl(camera.getStreamUrl())
                .isPublic(camera.isPublic())
                .location(camera.getLocation())
                .status(camera.getStatus())
                .build();
    }

    public Pagination getAllCameras(Specification<Camera> specification, Pageable pageable) {
        Page<Camera> pageCamera = cameraRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageCamera.getTotalPages());
        meta.setTotal(pageCamera.getTotalElements());

        pagination.setMeta(meta);

        List<CameraResponse> listCamera = pageCamera.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listCamera);

        return pagination;
    }

    public Pagination getPublicCameras(Specification<Camera> specification, Pageable pageable) {
        Page<Camera> pageCamera = cameraRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageCamera.getTotalPages());
        meta.setTotal(pageCamera.getTotalElements());

        pagination.setMeta(meta);

        List<CameraResponse> listCamera = pageCamera.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listCamera);

        return pagination;
    }

    public CameraResponse getCamera(Long id) throws AppException {
        Optional<Camera> camera = cameraRepository.findById(id);
        if (camera.isEmpty()) {
            throw new AppException(ErrorCode.CAMERA_NOT_FOUND);
        }
        return toResponse(camera.get());
    }

    public CameraResponse createCamera(CameraRequest request) {
        System.out.println(request);
        Camera camera = Camera.builder()
                .name(request.getName())
                .type(request.getType())
                .streamUrl(request.getStreamUrl())
                .isPublic(request.isPublic())
                .location(request.getLocation())
                .status(Camera.Status.ONLINE)
                .build();
        Camera savedCamera = cameraRepository.save(camera);
        return toResponse(savedCamera);
    }

    public CameraResponse updateCamera(Long id, CameraRequest request) {
        Optional<Camera> currentCamera = this.cameraRepository.findById(id);
        if (currentCamera.isEmpty()) {
            throw new AppException(ErrorCode.CAMERA_NOT_FOUND);
        }
        currentCamera.get().setLocation(request.getLocation());
        currentCamera.get().setName(request.getName());
        currentCamera.get().setStreamUrl(request.getStreamUrl());
        currentCamera.get().setPublic(request.isPublic());
        currentCamera.get().setType(request.getType());
        return this.toResponse(cameraRepository.save(currentCamera.get()));
    }

    public CameraResponse deleteCamera(Long id) {
        Optional<Camera> camera = this.cameraRepository.findById(id);
        if (camera.isEmpty()) {
            throw new AppException(ErrorCode.CAMERA_NOT_FOUND);
        }
        cameraRepository.delete(camera.get());
        return toResponse(camera.get());
    }

}
