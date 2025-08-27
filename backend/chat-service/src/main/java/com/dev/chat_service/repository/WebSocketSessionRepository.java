package com.dev.chat_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.chat_service.model.WebSocketSession;

public interface WebSocketSessionRepository
        extends JpaRepository<WebSocketSession, Long> {
            
    Optional<WebSocketSession> findByUserId(Long userId);

    void deleteBySocketSessionId(String socketId);

    List<WebSocketSession> findAllByUserIdIn(List<Long> userIds);
}