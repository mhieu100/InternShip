package com.dev.analysis_service.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import java.util.List;


public interface SumaryDailyRepository extends JpaRepository<SummaryDaily, Long>, JpaSpecificationExecutor<SummaryDaily> {
    SummaryDaily findByShelveAndDate(Shelve shelve, LocalDate date);
    List<SummaryDaily> findAllByDate(LocalDate date);
}
    