package com.mhieu.camera_service_v2.config;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@RequestMapping("/api/cameras")
public class StreamWebSocketHandler extends BinaryWebSocketHandler {

    private final Map<Long, CameraStream> activeStreams = new ConcurrentHashMap<>();

    public Map<Long, CameraStream> getActiveStreams() {
        return activeStreams;
    }

    public static class ClientSession {
        private final WebSocketSession session;

        public ClientSession(WebSocketSession session) {
            this.session = session;
        }

        public boolean isOpen() {
            return session.isOpen();
        }

        public void send(byte[] data) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new BinaryMessage(data));
                }
            } catch (Exception e) {
                log.debug("Error sending message: {}", e.getMessage());
            }
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            ClientSession that = (ClientSession) o;
            // Two ClientSessions are equal if their underlying WebSocketSession is the
            // same.
            return Objects.equals(session.getId(), that.session.getId());
        }

        @Override
        public int hashCode() {
            return Objects.hash(session.getId());
        }
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
            String rtspUrl = getRtspUrl(cameraId);

            if (rtspUrl == null) {
                log.error("Camera {} not found or RTSP URL not available", cameraId);
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            ClientSession clientSession = new ClientSession(session);
            CameraStream stream = activeStreams.computeIfAbsent(cameraId,
                    id -> new CameraStream(id, rtspUrl));

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

    public String getRtspUrl(Long cameraId) {

        return switch (cameraId.toString()) {
            case "1" -> "rtsp://localhost:8554/mystream1";
            case "2" -> "rtsp://localhost:8554/mystream2";
            default -> null;
        };
    }

    // @Override
    // public boolean equals(Object o) {
    // if (this == o) return true;
    // if (o == null || getClass() != o.getClass()) return false;
    // ClientSession that = (ClientSession) o;
    // // Two ClientSessions are equal if their underlying WebSocketSession is the
    // same.
    // return Objects.equals(session.getId(), that.session.getId());
    // }

    // @Override
    // public int hashCode() {
    // return Objects.hash(session.getId());
    // }
}