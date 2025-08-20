package com.dev.camera_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.camera_service.model.Camera;

public interface CameraRepository extends JpaRepository<Camera, Long>, JpaSpecificationExecutor<Camera> {
    boolean existsByName(String name);
    boolean existsByStreamUrl(String url);
}
