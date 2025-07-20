package com.mhieu.camera_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mhieu.camera_service.model.Camera;


public interface CameraRepository extends JpaRepository<Camera, Long>, JpaSpecificationExecutor<Camera> {
    Optional<Camera> findByName(String name);
}
