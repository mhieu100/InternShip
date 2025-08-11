package com.dev.analysis_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.Shelve;

public interface ShelveRepository extends JpaRepository<Shelve, Long>, JpaSpecificationExecutor<Shelve> {
    
}
