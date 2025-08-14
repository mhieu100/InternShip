package com.dev.analysis_service.socket;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
@RequiredArgsConstructor
public class DataProcessHandle extends TextWebSocketHandler {

    private final ShelveService shelveService;

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
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
        List<SummaryDailyResponse> cameraResponses = shelveService.getTotalByDate();
         String jsonMessage = new ObjectMapper().writeValueAsString(cameraResponses);
        session.sendMessage(new TextMessage(jsonMessage));
    }

}
