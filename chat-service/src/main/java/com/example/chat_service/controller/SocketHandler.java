package com.example.chat_service.controller;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.example.chat_service.model.WebSocketSession;
import com.example.chat_service.model.request.TokenRequest;
import com.example.chat_service.service.WebSocketSessionService;
import com.example.chat_service.service.httpclient.UserClient;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;
    WebSocketSessionService webSocketSessionService;
    UserClient userClient;

    @OnConnect
    public void clientConnected(SocketIOClient client) {

        String token = client.getHandshakeData().getSingleUrlParam("token");
        TokenRequest request = TokenRequest.builder().token(token).build();
        Long userId = Long.parseLong(this.userClient.chatChecker(request));

        WebSocketSession webSocketSession = WebSocketSession.builder()
                .socketSessionId(client.getSessionId().toString())
                .userId(userId).createdAt(Instant.now()).build();
        webSocketSession = this.webSocketSessionService.create(webSocketSession);
        log.info("Client connected: {}", webSocketSession.getId());

    }

    @OnDisconnect
    public void clientDisconnected(SocketIOClient client) {
        log.info("Client disConnected: {}", client.getSessionId());
        this.webSocketSessionService.deleteSession(client.getSessionId().toString());
    }

    @PostConstruct
    public void startServer() {
        server.start();
        server.addListeners(this);
        log.info("Socket server started");
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
        log.info("Socket server stoped");
    }
}
