package com.dev.stream_service.socket;

import com.dev.stream_service.dto.request.UpdateStatusRequest;
import com.dev.stream_service.dto.response.CameraResponse;
import com.dev.stream_service.model.CameraSnapshot;
import com.dev.stream_service.service.httpClient.CameraClient;
import com.dev.stream_service.utils.FFmpegUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.*;

@Component
public class HealthWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ConcurrentMap<Long, CameraSnapshot> lastStatusMap = new ConcurrentHashMap<>();

    private final FFmpegUtil ffmpegUtil;
    private final StreamWebSocketHandler streamHandler;
    private final ScheduledExecutorService scheduler;
    private final CameraClient cameraClient;

    public HealthWebSocketHandler(CameraClient cameraClient, FFmpegUtil ffmpegUtil, StreamWebSocketHandler streamHandler) {
        this.cameraClient = cameraClient;
        this.ffmpegUtil = ffmpegUtil;
        this.streamHandler = streamHandler;
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
        System.out.println("Received message: " + message.getPayload());
    }

    private void sendInitialStatus(WebSocketSession session) throws IOException {
        List<CameraResponse> cameras = ffmpegUtil.checkAllStreamURLActive();

        for (CameraResponse camera : cameras) {
            int viewerCount = streamHandler.getActiveStreams().containsKey(camera.getId()) ?
                    streamHandler.getActiveStreams().get(camera.getId()).getClientCount() : 0;
            camera.setViewerCount(viewerCount);
        }
        String jsonMessage = new ObjectMapper().writeValueAsString(cameras);
        session.sendMessage(new TextMessage(jsonMessage));
    }

    private void startHealthCheckLoop() {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                checkStatusChanges();
            } catch (Exception e) {
                 System.err.println("Health check error: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    private void checkStatusChanges() throws IOException {
        List<CameraResponse> currentStatus = ffmpegUtil.checkAllStreamURLActive();
        List<CameraResponse> changedCameras = new ArrayList<>();

        for (CameraResponse camera : currentStatus) {
            int viewerCount = streamHandler.getViewerCount(camera.getId());
            camera.setViewerCount(viewerCount);

            CameraSnapshot current = CameraSnapshot.fromCamera(camera);
            CameraSnapshot previous = lastStatusMap.get(camera.getId());

            if (previous == null || previous.isDifferent(camera)) {
                System.out.println("Detected change for camera " + camera.getId() + ": " + previous + " -> " + current );
                lastStatusMap.put(camera.getId(), current);
                changedCameras.add(camera);
            }
        }

        List<Long> toRemove = new ArrayList<>();
        for (Long id : lastStatusMap.keySet()) {
            if (currentStatus.stream().noneMatch(c -> Objects.equals(c.getId(), id))) {
                System.out.println("Camera " + id + " is no longer present");
                toRemove.add(id);

                CameraResponse offlineCamera = CameraResponse.builder()
                    .id(id)
                    .status(CameraResponse.Status.OFFLINE)
                    .viewerCount(0)
                    .build();
                changedCameras.add(offlineCamera);

                try {
                    cameraClient.updateStatusCamera(id, UpdateStatusRequest.builder()
                            .status(CameraResponse.Status.OFFLINE)
                            .viewerCount(0)
                            .build());
                    System.out.println("Updated camera " + id + " to OFFLINE status");
                } catch (Exception e) {
                    System.err.println("Error updating offline status for camera " + id + ": " + e.getMessage());
                }
            }
        }
        toRemove.forEach(lastStatusMap::remove);

        if (!changedCameras.isEmpty()) {
            System.out.println("Sending updates for changed cameras: " + changedCameras);
            String jsonMessage = new ObjectMapper().writeValueAsString(changedCameras);
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
}
