package com.dev.chat_service.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dev.chat_service.model.WebSocketSession;
import com.dev.chat_service.repository.WebSocketSessionRepository;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketSessionService {
    WebSocketSessionRepository webSocketSessionRepository;

    public WebSocketSession create(WebSocketSession webSocketSession) {
        return webSocketSessionRepository.save(webSocketSession);
    }

    public Optional<WebSocketSession> findByUserId(Long userId) {
        return this.webSocketSessionRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteSession(String sessionId) {
        webSocketSessionRepository.deleteBySocketSessionId(sessionId);
    }
}
