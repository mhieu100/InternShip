package com.dev.analysis_service.socket;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.dev.analysis_service.dto.response.SummaryDailyResponse;
import com.dev.analysis_service.service.ShelveService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
public class DataProcessHandle extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ShelveService shelveService;
    private final ScheduledExecutorService scheduler;

    public DataProcessHandle(ShelveService shelveService) {
        this.shelveService = shelveService;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        startDataUpdate();
    }

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        sendData(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws IOException {
        if (session.isOpen()) {
            session.close(CloseStatus.NORMAL);
        }

    }

    public void sendData(WebSocketSession session) throws IOException {
        List<SummaryDailyResponse> data = shelveService.getTotalByDate();
        String jsonMessage = new ObjectMapper().writeValueAsString(data);
        session.sendMessage(new TextMessage(jsonMessage));
    }

    private void startDataUpdate() {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                checkDataChanges();
            } catch (Exception e) {
                System.err.println("Data error: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    private void checkDataChanges() throws IOException {
        List<SummaryDailyResponse> data = shelveService.getTotalByDate();
        String jsonMessage = new ObjectMapper().writeValueAsString(data);
        broadcast(jsonMessage);
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
