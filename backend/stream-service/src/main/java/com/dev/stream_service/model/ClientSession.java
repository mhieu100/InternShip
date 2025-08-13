package com.dev.stream_service.model;

import java.util.Objects;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ClientSession {
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

        return Objects.equals(session.getId(), that.session.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(session.getId());
    }
}
