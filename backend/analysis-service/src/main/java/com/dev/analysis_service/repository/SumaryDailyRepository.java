package com.dev.analysis_service.repository;

import java.time.LocalDate;

import com.dev.analysis_service.dto.response.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SumaryDailyRepository extends JpaRepository<SummaryDaily, Long>, JpaSpecificationExecutor<SummaryDaily> {
    SummaryDaily findByShelveAndDate(Shelve shelve, LocalDate date);

    @Query(nativeQuery = true, value =
            "SELECT * " +
                    "FROM shelf_summary_daily " +
                    "WHERE date = :date AND shelf_id IN (:shelfIds)" )
    List<SummaryDaily> findAllByDate(@Param("date") LocalDate date, @Param("shelfIds") List<Long> shelfIds);

    @Query(nativeQuery = true, value =
            "SELECT AVG((shortage_hours / operating_hours) * 100) AS shortageRate, date " +
                    "FROM shelf_summary_daily " +
                    "WHERE date BETWEEN :startDate AND :endDate AND shelf_id IN (:shelfIds) " +
                    "GROUP BY date ORDER BY date ASC")
    List<ShortageRateResponse> getAverageShortageRate(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate,
                                                      @Param("shelfIds") List<Long> shelfIds);

    @Query(nativeQuery = true, value =
            "SELECT AVG((replenish_count / alert_count) * 100) AS recoveryRate  , date , 60 AS targetRate " +
                    "FROM shelf_summary_daily " +
                    "WHERE date BETWEEN :startDate AND :endDate AND shelf_id IN (:shelfIds) " +
                    "GROUP BY date ORDER BY date ASC")
    List<RecoveryRateResponse> getAverageRecoveryRate(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate,
                                                      @Param("shelfIds") List<Long> shelfIds);

    @Query(nativeQuery = true, value =
            "SELECT shelves.shelf_name , SUM(shelf_summary_daily.operating_hours) AS totalOperationHours , SUM(shelf_summary_daily.shortage_hours) AS totalShortageHours," +
                    " AVG((shelf_summary_daily.shortage_hours / shelf_summary_daily.operating_hours) * 100) AS totalShortageRate " +
                    "FROM shelf_summary_daily JOIN shelves ON shelf_summary_daily.shelf_id = shelves.shelf_id " +
                    "WHERE shelf_summary_daily.date BETWEEN :startDate AND :endDate AND shelf_summary_daily.shelf_id IN (:shelfIds) " +
                    "GROUP BY shelves.shelf_name")
    List<TotalShortageStatusResponse> getShortageStatusByEach(@Param("startDate") LocalDate startDate,
                                                              @Param("endDate") LocalDate endDate,
                                                              @Param("shelfIds") List<Long> shelfIds);

    @Query(nativeQuery = true, value =
            "SELECT shelves.shelf_name , SUM(shelf_summary_daily.alert_count) AS totalAlertCount , SUM(shelf_summary_daily.replenish_count) AS totalReplenishCount," +
                    " AVG((shelf_summary_daily.replenish_count / shelf_summary_daily.alert_count) * 100) AS totalRecoveryRate " +
                    "FROM shelf_summary_daily JOIN shelves ON shelf_summary_daily.shelf_id = shelves.shelf_id " +
                    "WHERE shelf_summary_daily.date BETWEEN :startDate AND :endDate AND shelf_summary_daily.shelf_id IN (:shelfIds) " +
                    "GROUP BY shelves.shelf_name")
    List<TotalRecoveryStatusResponse> getRecoveryStatusByEach(@Param("startDate") LocalDate startDate,
                                                              @Param("endDate") LocalDate endDate,
                                                              @Param("shelfIds") List<Long> shelfIds);

//    @Query(nativeQuery = true, value =
//            "SELECT date_part('year', shelf_summary_daily.date ) AS yyyy," +
//                    " date_part('month', shelf_summary_daily.date) AS mm," +
//                    " date_part('day', shelf_summary_daily.date) AS dd," +
//                    " shelf_summary_daily.operating_hours, shelf_summary_daily.shortage_hours," +
//                    " (shelf_summary_daily.shortage_hours / shelf_summary_daily.operating_hours) * 100 AS shortage_rate," +
//                    " shelf_summary_daily.alert_count, shelf_summary_daily.replenish_count," +
//                    " (shelf_summary_daily.replenish_count / shelf_summary_daily.alert_count) * 100 AS recover_rate," +
//                    " shelves.shelf_name" +
//                    " FROM shelf_summary_daily JOIN shelves ON shelf_summary_daily.shelf_id = shelves.shelf_id " +
//                    " WHERE shelf_summary_daily.date BETWEEN :startDate AND :endDate AND shelf_summary_daily.shelf_id IN (:shelfIds) " +
//                    " ORDER BY yyyy, mm, dd;")
    @Query(nativeQuery = true, value =
        "SELECT date_part('year', shelf_summary_daily.date ) AS year," +
                " date_part('month', shelf_summary_daily.date) AS month," +
                " date_part('day', shelf_summary_daily.date) AS day," +
                " shelf_summary_daily.operating_hours, shelf_summary_daily.shortage_hours," +
//                " (shelf_summary_daily.shortage_hours / shelf_summary_daily.operating_hours) * 100 AS shortage_rate," +
                " shelf_summary_daily.alert_count, shelf_summary_daily.replenish_count," +
//                " (shelf_summary_daily.replenish_count / shelf_summary_daily.alert_count) * 100 AS recover_rate," +
                " shelves.shelf_name" +
                " FROM shelf_summary_daily JOIN shelves ON shelf_summary_daily.shelf_id = shelves.shelf_id " +
                " WHERE shelf_summary_daily.date BETWEEN :startDate AND :endDate AND shelf_summary_daily.shelf_id IN (:shelfIds) " +
                " ORDER BY year, month, day;")
    List<TreeDataResponse> getDataTree(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate,
                                       @Param("shelfIds") List<Long> shelfIds);
}
    