package com.dev.analysis_service.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dev.analysis_service.dto.response.MetricResponse;
import com.dev.analysis_service.dto.response.ShelveResponse;
import com.dev.analysis_service.dto.response.SummaryDailyResponse;
import com.dev.analysis_service.model.Metric;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import com.dev.analysis_service.repository.MetricRepository;
import com.dev.analysis_service.repository.SumaryDailyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShelveService {
    private final SumaryDailyRepository sumaryDailyRepository;
    private final MetricRepository metricRepository;

    public ShelveResponse toResponse(Shelve shelve) {
        return ShelveResponse.builder()
                .shelfId(shelve.getShelfId())
                .shelfName(shelve.getShelfName())
                .build();
    }

    public MetricResponse toResponse(Metric metric) {
        return MetricResponse.builder()
                .shelveName(metric.getShelve().getShelfName())
                .time(metric.getTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")))
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

    public List<SummaryDailyResponse> getTotalByDate() {
        List<SummaryDaily> list = sumaryDailyRepository.findAllByDate(LocalDate.of(2025, 8, 15));
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MetricResponse> getRealtimeMetrics() {
        LocalDate currentDate = LocalDate.of(2025, 8, 15);
        List<Metric> metrics = metricRepository.getDataMetricOfDate(currentDate);
        System.out.println("Retrieved " + metrics.size() + " metrics for date: " + currentDate);

        List<MetricResponse> responses = metrics.stream().map(this::toResponse).toList();
        System.out.println("Converted to " + responses.size() + " metric responses");

        return responses;
    }

}
