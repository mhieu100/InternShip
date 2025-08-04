package com.mhieu.camera_service.socket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mhieu.camera_service.model.Camera;

import com.mhieu.camera_service.util.FFmpegUtil;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class HealthCheckSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final FFmpegUtil ffmpegUtil;
    private ScheduledExecutorService scheduler;

    public HealthCheckSocketHandler(FFmpegUtil ffmpegUtil) {
        this.ffmpegUtil = ffmpegUtil;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        startHealthCheckLoop();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);

        sendInitialStatus(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received from client: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        try {
            if (session.isOpen()) {
                session.close(CloseStatus.NORMAL); // Đảm bảo đóng sạch
            }
        } catch (IOException e) {
            System.out.println("Error closing session: {}" + e.getMessage());
        }
    }

    private void startHealthCheckLoop() {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                checkAndNotifyStatusChanges();
            } catch (Exception e) {
                // System.err.println("Health check error: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    private void checkAndNotifyStatusChanges() throws IOException {
        List<Camera> currentStatus = ffmpegUtil.checkAllStreamURLActive();

        if (!currentStatus.isEmpty()) {
            String jsonMessage = new ObjectMapper().writeValueAsString(currentStatus);
            broadcast(jsonMessage);
        }
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

    private void sendInitialStatus(WebSocketSession session) throws IOException {
        List<Camera> cameras = ffmpegUtil.checkAllStreamURLActive();
        String jsonMessage = new ObjectMapper().writeValueAsString(cameras);
        session.sendMessage(new TextMessage(jsonMessage));
    }

}