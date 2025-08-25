package com.dev.analysis_service.socket;

import java.io.IOException;
    import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.dev.analysis_service.dto.response.MetricResponse;
import com.dev.analysis_service.dto.response.SummaryDailyResponse;
import com.dev.analysis_service.service.ShelveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;


@Component
public class DataProcessHandle extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ShelveService shelveService;
    private ScheduledExecutorService scheduler;
    private List<MetricResponse> previousMetricData = new ArrayList<>();
    private final ObjectMapper mapper = new ObjectMapper();

    public DataProcessHandle(ShelveService shelveService) {
        this.shelveService = shelveService;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
    }

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String sessionId = session.getId();
        System.out.println("Connection attempt: " + sessionId);


        if (sessions.contains(session)) {
            System.out.println("Reconnection detected for session: " + sessionId);
        } else {
            sessions.add(session);
            System.out.println("New connection established: " + sessionId);

                startDataUpdate();
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws IOException {
        sessions.remove(session);
        System.out.println("Disconnect socket " + session.getId());
        if (session.isOpen()) {
            session.close(CloseStatus.NORMAL);
        }
        if(sessions.isEmpty()) {
            stopSchedulerIfNoConnections();
        }
    }

    public void sendData(WebSocketSession session) throws IOException {
        // Send summary data
        List<SummaryDailyResponse> summaryData = shelveService.getTotalByDate();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode summaryMessage = mapper.createObjectNode();
        summaryMessage.put("type", "summary");
        summaryMessage.set("data", mapper.valueToTree(summaryData));
        session.sendMessage(new TextMessage(mapper.writeValueAsString(summaryMessage)));

        // Send metrics data
        List<MetricResponse> metricData = shelveService.getRealtimeMetrics();
        ObjectNode metricMessage = mapper.createObjectNode();
        metricMessage.put("type", "metrics");
        metricMessage.set("data", mapper.valueToTree(metricData));
        session.sendMessage(new TextMessage(mapper.writeValueAsString(metricMessage)));
    }

    private void startDataUpdate() {
        if (scheduler.isShutdown() || scheduler.isTerminated()) {
            scheduler = Executors.newSingleThreadScheduledExecutor();
        }
        scheduler.scheduleAtFixedRate(() -> {
            try {
                checkDataChanges();
            } catch (Exception e) {
                System.err.println("Data error: " + e.getMessage());
            }
        }, 0, 15, TimeUnit.SECONDS); // Update every 15 seconds to match the metrics interval
    }

    private void checkDataChanges() throws IOException {
        try {
            List<SummaryDailyResponse> summaryData = shelveService.getTotalByDate();
            ObjectNode summaryMessage = mapper.createObjectNode();
            summaryMessage.put("type", "summary");
            summaryMessage.set("data", mapper.valueToTree(summaryData));
            String summaryJson = mapper.writeValueAsString(summaryMessage);
            System.out.println("Sending summary data: " + summaryJson);
            broadcast(summaryJson);

            List<MetricResponse> currentMetricData = shelveService.getRealtimeMetrics();
            if (!areMetricsEqual(previousMetricData, currentMetricData)) {
                ObjectNode metricMessage = mapper.createObjectNode();
                metricMessage.put("type", "metrics");
                metricMessage.set("data", mapper.valueToTree(currentMetricData));
                String metricJson = mapper.writeValueAsString(metricMessage);
                System.out.println("Sending new metric data: " + metricJson);
                broadcast(metricJson);
                previousMetricData = currentMetricData;
            }
        } catch (Exception e) {
            System.err.println("Error in checkDataChanges: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void stopSchedulerIfNoConnections() {
        if (sessions.isEmpty()) {
            scheduler.shutdown();
            System.out.println("Scheduler stopped - no active connections");
        }
    }

    private boolean areMetricsEqual(List<MetricResponse> previous, List<MetricResponse> current) {
        if (previous.size() != current.size()) {
            return false;
        }

        for (int i = 0; i < previous.size(); i++) {
            MetricResponse prev = previous.get(i);
            MetricResponse curr = current.get(i);
            if (!Objects.equals(prev, curr)) {
                return false;
            }
        }
        return true;
    }

    public void broadcast(String jsonMessage) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(jsonMessage));
                } catch (IOException e) {
                    System.err.println("Error sending message to session " + session.getId());
                }
            }
        }
    }
}
