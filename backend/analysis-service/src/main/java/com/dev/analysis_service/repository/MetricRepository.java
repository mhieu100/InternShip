package com.dev.analysis_service.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.Metric;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface MetricRepository extends JpaRepository<Metric, Long>, JpaSpecificationExecutor<Metric> {

    @Query(nativeQuery = true, value = 
           "SELECT * FROM shelf_metrics " +
           "WHERE date = :date " +
           "AND EXTRACT(MINUTE FROM time) % 15 = 0 " +
           "AND EXTRACT(SECOND FROM time) = 0 AND shelf_id IN (:shelfIds) " +
           "ORDER BY time ASC")
    List<Metric> getDataMetricOfDate(@Param("date") LocalDate date, @Param("shelfIds") List<Long> shelfIds);
}
