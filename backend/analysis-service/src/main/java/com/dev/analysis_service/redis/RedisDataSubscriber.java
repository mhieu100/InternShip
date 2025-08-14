package com.dev.analysis_service.redis;

import lombok.RequiredArgsConstructor;


import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import com.dev.analysis_service.model.Metric;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import com.dev.analysis_service.model.Threshold;
import com.dev.analysis_service.repository.MetricRepository;
import com.dev.analysis_service.repository.ShelveRepository;
import com.dev.analysis_service.repository.SumaryDailyRepository;
import com.dev.analysis_service.repository.ThresholdRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class RedisDataSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final ShelveRepository shelveRepository;
    private final MetricRepository metricRepository;
    private final SumaryDailyRepository sumaryDailyRepository;
    private final ThresholdRepository thresholdRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());

            Shelve shelve = objectMapper.readValue(json, Shelve.class);
            Shelve currentShelve = shelveRepository.findById(shelve.getShelfId())
                    .orElseThrow(() -> new RuntimeException("Shelve not found: " + shelve.getShelfId()));

            Metric metric = objectMapper.readValue(json, Metric.class);
            metric.setShelve(shelve);
            metricRepository.save(metric);

            Threshold threshold = objectMapper.readValue(json, Threshold.class);
            threshold.setShelve(shelve);
            Threshold existingThreshold = thresholdRepository.findByShelve(currentShelve);
            if (existingThreshold != null) {

            } else {
                thresholdRepository.save(threshold);
            }

            SummaryDaily summaryDaily = objectMapper.readValue(json, SummaryDaily.class);
            summaryDaily.setShelve(shelve);
            SummaryDaily existingSummary = sumaryDailyRepository.findByShelveAndDate(currentShelve,
                    summaryDaily.getDate());
            if (existingSummary != null) {
                existingSummary.setOperatingHours(summaryDaily.getOperatingHours());
                existingSummary.setShortageHours(summaryDaily.getShortageHours());
                existingSummary.setAlertCount(summaryDaily.getAlertCount());
                existingSummary.setReplenishCount(summaryDaily.getReplenishCount());
                sumaryDailyRepository.save(existingSummary);
            } else {
                sumaryDailyRepository.save(summaryDaily);
            }
            System.out.println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
