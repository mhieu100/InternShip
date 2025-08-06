package com.mhieu.camera_service.socket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mhieu.camera_service.dto.response.CameraResponse;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.model.CameraSnapshot;
import com.mhieu.camera_service.util.FFmpegUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class HealthCheckSocketHandler extends TextWebSocketHandler {

    private final ConcurrentMap<Long, CameraSnapshot> lastStatusMap = new ConcurrentHashMap<>();
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final FFmpegUtil ffmpegUtil;
    private final StreamWebSocketHandler streamHandler;
    private ScheduledExecutorService scheduler;

    public HealthCheckSocketHandler(FFmpegUtil ffmpegUtil, StreamWebSocketHandler streamHandler) {
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
        System.out.println("Received from client: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        try {
            if (session.isOpen()) {
                session.close(CloseStatus.NORMAL);
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
        List<CameraResponse> changedCameras = new ArrayList<>();

        // System.out.println("Current status: " + currentStatus);
        // System.out.println("Last status: " + lastStatusMap);

        for (Camera camera : currentStatus) {
            long id = camera.getId();
            CameraSnapshot current = CameraSnapshot.fromCamera(camera);
            CameraSnapshot previous = lastStatusMap.get(id);

            // Get current viewer count for this camera
            int viewerCount = streamHandler.getActiveStreams().containsKey(id) ? 
                streamHandler.getActiveStreams().get(id).getClientCount() : 0;
            
            // If camera is offline, set viewer count to 0
            if (camera.getStatus() == Camera.Status.OFFLINE) {
                viewerCount = 0;
            }

            if (previous == null || previous.isDifferent(camera) || hasViewerCountChanged(id, viewerCount)) {
                System.out.println("Detected change for camera " + id + ": " + previous + " -> " + current + " (viewers: " + viewerCount + ")");
                lastStatusMap.put(id, current);
                
                // Convert Camera to CameraResponse with viewer count
                CameraResponse cameraResponse = convertToCameraResponse(camera, viewerCount);
                changedCameras.add(cameraResponse);
            }
        }

        // Kiểm tra các camera đã biến mất (không còn trong currentStatus)
        List<Long> toRemove = new ArrayList<>();
        for (Long id : lastStatusMap.keySet()) {
            if (currentStatus.stream().noneMatch(c -> c.getId() == id)) {
                System.out.println("Camera " + id + " is no longer present");
                toRemove.add(id);
                
                CameraResponse removedCamera = new CameraResponse();
                removedCamera.setId(id);
                removedCamera.setStatus(Camera.Status.OFFLINE);
                removedCamera.setViewerCount(0);
                changedCameras.add(removedCamera);
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

    private void sendInitialStatus(WebSocketSession session) throws IOException {
        List<Camera> cameras = ffmpegUtil.checkAllStreamURLActive();
        List<CameraResponse> cameraResponses = new ArrayList<>();
        
        for (Camera camera : cameras) {
            int viewerCount = streamHandler.getActiveStreams().containsKey(camera.getId()) ? 
                streamHandler.getActiveStreams().get(camera.getId()).getClientCount() : 0;
            cameraResponses.add(convertToCameraResponse(camera, viewerCount));
        }
        
        String jsonMessage = new ObjectMapper().writeValueAsString(cameraResponses);
        session.sendMessage(new TextMessage(jsonMessage));
    }

    // Track last known viewer counts to detect changes
    private final ConcurrentMap<Long, Integer> lastViewerCounts = new ConcurrentHashMap<>();

    private boolean hasViewerCountChanged(Long cameraId, int currentViewerCount) {
        Integer lastCount = lastViewerCounts.get(cameraId);
        if (lastCount == null || !lastCount.equals(currentViewerCount)) {
            lastViewerCounts.put(cameraId, currentViewerCount);
            return true;
        }
        return false;
    }

    private CameraResponse convertToCameraResponse(Camera camera, int viewerCount) {
        CameraResponse response = new CameraResponse();
        response.setId(camera.getId());
        response.setName(camera.getName());
        response.setLocation(camera.getLocation());
        response.setStatus(camera.getStatus());
        response.setStreamUrl(camera.getStreamUrl());
        response.setResolution(camera.getResolution());
        response.setFps(camera.getFps());
        response.setType(camera.getType());
        response.setPublic(camera.isPublic());
        response.setViewerCount(viewerCount);
        return response;
    }

}