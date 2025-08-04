package com.mhieu.camera_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.model.CheckHistory;


public interface CheckHistoryRepository extends JpaRepository<CheckHistory, Long>, JpaSpecificationExecutor<CheckHistory> {
    Optional<Camera> findByName(String name);
}
