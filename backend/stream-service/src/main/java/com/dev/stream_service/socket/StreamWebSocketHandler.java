package com.dev.stream_service.socket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.stream_service.dto.response.ApiResponse;
import com.dev.stream_service.dto.response.CameraResponse;
import com.dev.stream_service.model.CameraStream;
import com.dev.stream_service.model.ClientSession;
import com.dev.stream_service.service.httpClient.CameraClient;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequestMapping("/api/cameras")
public class StreamWebSocketHandler extends BinaryWebSocketHandler {

    private final Map<Long, CameraStream> activeStreams = new ConcurrentHashMap<>();
    private final CameraClient cameraClient;

    public StreamWebSocketHandler(CameraClient cameraClient) {
        this.cameraClient = cameraClient;
    }

    public Map<Long, CameraStream> getActiveStreams() {
        return activeStreams;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            UriComponents uri = UriComponentsBuilder.fromUri(session.getUri()).build();
            String cameraIdStr = uri.getQueryParams().getFirst("cameraId");

            if (cameraIdStr == null) {
                log.error("No camera ID provided");
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            Long cameraId = Long.parseLong(cameraIdStr);
            ApiResponse<CameraResponse> response = cameraClient.getCameraById(cameraId);
            CameraResponse camera = response.getData();
            if (camera.getStreamUrl() == null) {
                log.error("Camera {} not found or RTSP URL not available", cameraId);
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            ClientSession clientSession = new ClientSession(session);
            CameraStream stream = activeStreams.computeIfAbsent(cameraId,
                    id -> new CameraStream(id, camera.getStreamUrl(), cameraClient));

            // cameraService.updateStatusCamera(cameraId, UpdateStatusCameraRequest.builder()
            //         .status(Camera.Status.ONLINE).fps(camera.getFps()).resolution(camera.getResolution()).build());
            stream.addClient(clientSession);
            session.getAttributes().put("cameraId", cameraId);

            log.info("Client connected to camera {}. Total clients: {}",
                    cameraId, stream.getClientCount());

        } catch (Exception e) {
            log.error("Error establishing connection: {}", e.getMessage());
            try {
                session.close(CloseStatus.SERVER_ERROR);
            } catch (Exception ex) {
                log.error("Error closing session: {}", ex.getMessage());
            }
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        try {
            Long cameraId = (Long) session.getAttributes().get("cameraId");
            if (cameraId != null) {
                CameraStream stream = activeStreams.get(cameraId);
                if (stream != null) {
                    stream.removeClient(new ClientSession(session));

                    if (!stream.hasClients()) {
                        activeStreams.remove(cameraId);
                        log.info("Removed stream for camera {} as it has no clients", cameraId);

                    }
                }
            }
        } catch (Exception e) {
            log.error("Error closing connection: {}", e.getMessage());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("Transport error: {}", exception.getMessage());
        try {
            session.close(CloseStatus.SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error closing session after transport error: {}", e.getMessage());
        }
    }

    public int getViewerCount(Long cameraId) {
        CameraStream stream = activeStreams.get(cameraId);
        return stream != null ? stream.getClientCount() : 0;
    }

}