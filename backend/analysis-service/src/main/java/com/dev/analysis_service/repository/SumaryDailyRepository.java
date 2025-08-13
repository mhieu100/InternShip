package com.dev.analysis_service.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.SummaryDaily;

public interface SumaryDailyRepository extends JpaRepository<SummaryDaily, Long>, JpaSpecificationExecutor<SummaryDaily> {
    
}
    