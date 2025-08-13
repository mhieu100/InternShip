package com.dev.analysis_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.dev.analysis_service.dto.response.MetricResponse;
import com.dev.analysis_service.dto.response.Pagination;
import com.dev.analysis_service.dto.response.ShelveResponse;
import com.dev.analysis_service.dto.response.SummaryDailyResponse;
import com.dev.analysis_service.model.Metric;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import com.dev.analysis_service.repository.MetricRepository;
import com.dev.analysis_service.repository.ShelveRepository;
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
                .shelfId(shelve.getShelfId())
                .name(shelve.getName())
                .build();
    }

    public MetricResponse toResponse(Metric metric) {
        return MetricResponse.builder()
                .shelveName(metric.getShelve().getName())
                .date(metric.getDate())
                .time(metric.getTime())
                .osaRate(metric.getOsaRate())
                .build();
    }

    public SummaryDailyResponse toResponse(SummaryDaily summaryDaily) {
        return SummaryDailyResponse.builder()
                .shelveName(summaryDaily.getShelve().getName())
                .date(summaryDaily.getDate())
                .operatingHours(summaryDaily.getOperatingHours())
                .shortageHours(summaryDaily.getShortageHours())
                .shortageRate((summaryDaily.getShortageHours() / summaryDaily.getOperatingHours()) * 100)
                .alertCount(summaryDaily.getAlertCount())
                .replenishCount(summaryDaily.getReplenishCount())
                .recoveryRate((summaryDaily.getReplenishCount() / summaryDaily.getAlertCount()) * 100)
                .build();
    }

    public Pagination getAllShelves(Specification<Shelve> specification, Pageable pageable) {
        Page<Shelve> pageShelve = shelveRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageShelve.getTotalPages());
        meta.setTotal(pageShelve.getTotalElements());

        pagination.setMeta(meta);

        List<ShelveResponse> listShelve = pageShelve.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listShelve);

        return pagination;
    }

    public Pagination getTotalDetail(Specification<SummaryDaily> specification, Pageable pageable) {
        Page<SummaryDaily> pageSummary = sumaryDailyRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageSummary.getTotalPages());
        meta.setTotal(pageSummary.getTotalElements());

        pagination.setMeta(meta);

        List<SummaryDailyResponse> listSummary = pageSummary.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listSummary);

        return pagination;
    }

    public Pagination getMetrics(Specification<Metric> specification, Pageable pageable) {
        Page<Metric> pageMetrics = metricRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageMetrics.getTotalPages());
        meta.setTotal(pageMetrics.getTotalElements());

        pagination.setMeta(meta);

        List<MetricResponse> listMetrics = pageMetrics.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listMetrics);

        return pagination;
    }

}

