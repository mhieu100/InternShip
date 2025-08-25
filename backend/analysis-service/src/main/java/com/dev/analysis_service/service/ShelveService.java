package com.dev.analysis_service.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.dev.analysis_service.dto.response.*;
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
    private final SumaryDailyRepository sumaryDailyRepository;
    private final MetricRepository metricRepository;

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
//        System.out.println("Retrieved " + metrics.size() + " metrics for date: " + currentDate);
        List<MetricResponse> responses = metrics.stream().map(this::toResponse).toList();
//        System.out.println("Converted to " + responses.size() + " metric responses");
        return responses;
    }


    public List<ShortageRateResponse> getData() {
        List<ShortageRateResponse> list = new ArrayList<>();
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 15)).shortageRate(50).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 16)).shortageRate(40).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 17)).shortageRate(60).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 18)).shortageRate(75).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 19)).shortageRate(45).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 20)).shortageRate(35).build());
        list.add(ShortageRateResponse.builder().date(LocalDate.of(2025, 8, 21)).shortageRate(80).build());
        return list;
    }


    public List<TotalRateByShelfResponse> getData_1() {
        List<TotalRateByShelfResponse> list = new ArrayList<>();
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 1").totalHours(9.0).shortageHours(0.9).shortageRate(50).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 2").totalHours(7.0).shortageHours(1.9).shortageRate(40).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 3").totalHours(8.0).shortageHours(0.6).shortageRate(60).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 4").totalHours(7.0).shortageHours(1.2).shortageRate(75).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 5").totalHours(8.0).shortageHours(1.0).shortageRate(45).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 6").totalHours(9.0).shortageHours(1.1).shortageRate(35).build());
        list.add(TotalRateByShelfResponse.builder().shelf("Shelf 7").totalHours(9.0).shortageHours(0.6).shortageRate(80).build());
        return list;
    }
}
