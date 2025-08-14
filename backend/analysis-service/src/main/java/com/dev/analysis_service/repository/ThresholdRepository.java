package com.dev.analysis_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.Threshold;

public interface ThresholdRepository extends JpaRepository<Threshold, Long>, JpaSpecificationExecutor<Threshold> {
    Threshold findByShelve(Shelve shelve);
}
