package com.mhieu.camera_service.service;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhieu.camera_service.dto.request.CameraRequest;
import com.mhieu.camera_service.dto.request.UpdateStatusCameraRequest;
import com.mhieu.camera_service.dto.response.CameraResponse;
import com.mhieu.camera_service.dto.response.PaginationResponse;
import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.repository.CameraRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CameraService {

    private final CameraRepository cameraRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public CameraResponse createCamera(CameraRequest request) {
        if (cameraRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.DUPLICATE_RESOURCE);
        }
        Camera camera = modelMapper.map(request, Camera.class);
        camera = cameraRepository.save(camera);
        return modelMapper.map(camera, CameraResponse.class);
    }

    @Transactional(readOnly = true)
    public CameraResponse getCameraById(Long id) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DATA_NOT_FOUND));
        return modelMapper.map(camera, CameraResponse.class);
    }

    @Transactional(readOnly = true)
    public PaginationResponse getAllCameras(Specification<Camera> specification, Pageable pageable) {

        Page<Camera> pageCamera = cameraRepository.findAll(specification, pageable);
        PaginationResponse response = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageCamera.getTotalPages());
        meta.setTotal(pageCamera.getTotalElements());

        response.setMeta(meta);

        List<CameraResponse> listCamera = pageCamera.getContent()
                .stream().map(camera -> modelMapper.map(camera, CameraResponse.class))
                .collect(Collectors.toList());

        response.setResult(listCamera);
        return response;
    }

    @Transactional
    public CameraResponse updateCamera(Long id, CameraRequest request) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DATA_NOT_FOUND));
        modelMapper.map(request, camera);
        camera = cameraRepository.save(camera);
        return modelMapper.map(camera, CameraResponse.class);
    }

    @Transactional
    public CameraResponse updateStatusCamera(Long id, UpdateStatusCameraRequest request) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DATA_NOT_FOUND));
        modelMapper.map(request, camera);
        camera = cameraRepository.save(camera);
        return modelMapper.map(camera, CameraResponse.class);
    }


    @Transactional
    public void deleteCamera(Long id) {
        if (!cameraRepository.existsById(id)) {
            throw new AppException(ErrorCode.DATA_NOT_FOUND);
        }
        cameraRepository.deleteById(id);
    }
}