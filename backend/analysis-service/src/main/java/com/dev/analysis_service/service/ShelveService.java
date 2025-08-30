package com.dev.analysis_service.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.dev.analysis_service.dto.request.PotentialLossRequest;
import com.dev.analysis_service.dto.response.*;
import com.dev.analysis_service.repository.ShelveRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.dev.analysis_service.model.Metric;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import com.dev.analysis_service.repository.MetricRepository;
import com.dev.analysis_service.repository.SumaryDailyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShelveService {
    private final ShelveRepository shelveRepository;
    private final SumaryDailyRepository sumaryDailyRepository;
    private final MetricRepository metricRepository;

    public ShelveResponse toResponse(Shelve shelve) {
        return ShelveResponse.builder()
                .shelveId(shelve.getShelfId())
                .shelveName(shelve.getShelfName())
                .build();
    }

    public MetricResponse toResponse(Metric metric) {
        return MetricResponse.builder()
                .shelveName(metric.getShelve().getShelfName())
                .time(metric.getTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .osaRate(metric.getOsaRate())
                .build();
    }

    public SummaryDailyResponse toResponse(SummaryDaily summaryDaily) {
        return SummaryDailyResponse.builder()
                .shelveId(summaryDaily.getShelve().getShelfId())
                .shelveName(summaryDaily.getShelve().getShelfName())
                .date(String.valueOf(summaryDaily.getDate()))
                .operatingHours(summaryDaily.getOperatingHours())
                .shortageHours(summaryDaily.getShortageHours())
                .shortageRate((summaryDaily.getShortageHours() / summaryDaily.getOperatingHours()) * 100)
                .alertCount(summaryDaily.getAlertCount())
                .replenishCount(summaryDaily.getReplenishCount())
                .recoveryRate((summaryDaily.getReplenishCount() / summaryDaily.getAlertCount()) * 100)
                .build();
    }

    public List<SummaryDailyResponse> getTotalByDate(List<Long> ids) {
        List<SummaryDaily> list = sumaryDailyRepository.findAllByDate(LocalDate.of(2025, 8, 28), ids);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Pagination getAllShelves(Specification<Shelve> specification, Pageable pageable) {
        Page<Shelve> pageShelve = shelveRepository .findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageShelve.getTotalPages());
        meta.setTotal(pageShelve.getTotalElements());

        pagination.setMeta(meta);

        pagination.setResult(pageShelve.getContent().stream().map(this::toResponse).toList());
        return pagination;
    }

    public List<MetricResponse> getRealtimeMetrics(List<Long> ids) {
        LocalDate currentDate = LocalDate.of(2025, 8, 28);
        List<Metric> metrics = metricRepository.getDataMetricOfDate(currentDate, ids);
        return metrics.stream().map(this::toResponse).toList();
    }

    public List<Long> getListShelfId(String[] string) {
        if(Objects.equals(string[0], "all")) {
            return shelveRepository.findAll().stream().map(Shelve::getShelfId).toList();
        } else {
            return Arrays.stream(string)
                    .map(Long::parseLong).toList();
        }
    }

    public List<ShortageRateResponse> getAverageShortageRate(PotentialLossRequest request) {
        List<Long> shelfIds = getListShelfId(request.getIncludeShelf());

       return sumaryDailyRepository.getAverageShortageRate(request.getStartDate(), request.getEndDate(), shelfIds);
    }

    public List<RecoveryRateResponse> getAverageRecoveryRate(PotentialLossRequest request) {
        List<Long> shelfIds = getListShelfId(request.getIncludeShelf());
        return sumaryDailyRepository.getAverageRecoveryRate(request.getStartDate(), request.getEndDate(), shelfIds);
    }

    public List<TotalShortageStatusResponse> getShortageStatusByEach(PotentialLossRequest request) {
        List<Long> shelfIds = getListShelfId(request.getIncludeShelf());
        return sumaryDailyRepository.getShortageStatusByEach(request.getStartDate(), request.getEndDate(), shelfIds);
    }

    public List<TotalRecoveryStatusResponse> getRecoveryStatusByEach(PotentialLossRequest request) {
        List<Long> shelfIds = getListShelfId(request.getIncludeShelf());
        return sumaryDailyRepository.getRecoveryStatusByEach(request.getStartDate(), request.getEndDate(), shelfIds);
    }
}
