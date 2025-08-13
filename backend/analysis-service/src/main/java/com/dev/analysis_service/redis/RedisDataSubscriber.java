package com.dev.analysis_service.redis;

import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import com.dev.analysis_service.model.Metric;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.model.SummaryDaily;
import com.dev.analysis_service.repository.MetricRepository;
import com.dev.analysis_service.repository.ShelveRepository;
import com.dev.analysis_service.repository.SumaryDailyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class RedisDataSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final ShelveRepository shelveRepository;
    private final MetricRepository metricRepository;
    private final SumaryDailyRepository sumaryDailyRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());

            Shelve shelve = objectMapper.readValue(json, Shelve.class);
            Shelve currentShelve = shelveRepository.findById(shelve.getShelfId())
                    .orElseThrow(() -> new RuntimeException("Shelve not found: " + shelve.getShelfId()));

            Metric metric = objectMapper.readValue(json, Metric.class);
            // metric.setShelve(shelve);
            // metricRepository.save(metric);

            SummaryDaily summaryDaily = objectMapper.readValue(json, SummaryDaily.class);
            summaryDaily.setShelve(shelve);

            SummaryDaily existingSummary = sumaryDailyRepository.findByShelveAndDate(currentShelve,
                    summaryDaily.getDate());
            if (existingSummary != null) {
                System.out.println("Updating existing summary for shelve: " + currentShelve.getShelfName()
                        + " on date: " + summaryDaily.getDate());
                existingSummary.setOperatingHours(summaryDaily.getOperatingHours());
                existingSummary.setShortageHours(summaryDaily.getShortageHours());
                existingSummary.setAlertCount(existingSummary.getAlertCount());
                existingSummary.setReplenishCount(existingSummary.getReplenishCount());
                // sumaryDailyRepository.save(existingSummary);
            } else {
                // sumaryDailyRepository.save(summaryDaily);
            }
System.out.println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
