package com.dev.chat_service.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.dev.chat_service.dto.response.ApiResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOServer;
import com.dev.chat_service.exception.AppException;
import com.dev.chat_service.exception.ErrorCode;
import com.dev.chat_service.model.ChatMessage;
import com.dev.chat_service.model.Conversation;
import com.dev.chat_service.model.WebSocketSession;
import com.dev.chat_service.dto.request.ChatMessageRequest;
import com.dev.chat_service.dto.response.ChatMessageResponse;
import com.dev.chat_service.dto.response.UserResponse;
import com.dev.chat_service.repository.ChatMessageRepository;
import com.dev.chat_service.repository.ConversationRepository;
import com.dev.chat_service.repository.WebSocketSessionRepository;
import com.dev.chat_service.service.httpclient.UserClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatMessageService {
    ChatMessageRepository chatMessageRepository;
    ConversationRepository conversationRepository;
    UserClient userClient;
    SocketIOServer socketIOServer;
    WebSocketSessionRepository webSocketSessionRepository;
    ObjectMapper objectMapper;

    public List<ChatMessageResponse> getMessages(Long conversationId) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        this.conversationRepository
                .findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND))
                .getParticipantIds()
                .stream()
                .filter(participantInfo -> userId.equals(participantInfo))
                .findAny()
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        var messages = chatMessageRepository.findAllByConversationIdOrderByCreatedDateDesc(conversationId);

        return messages.stream().map(this::toChatMessageResponse).toList();
    }

    public ChatMessageResponse create(ChatMessageRequest request) {

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Validate conversationId
        Conversation conversation = this.conversationRepository
                .findById(request.getConversationId())
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        conversation.getParticipantIds()
                .stream()
                .filter(userId::equals)
                .findAny()
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        ApiResponse<UserResponse> userResponse = userClient.getUserById(userId);
        if (Objects.isNull(userResponse)) {
            throw new AppException(ErrorCode.CREATE_CONVERSATION_FAILED);
        }

        // Build Chat message Info
        ChatMessage chatMessage = toChatMessage(request);
        chatMessage.setSender(userId);
        chatMessage.setCreatedDate(Instant.now());

        // Create chat message
        chatMessage = chatMessageRepository.save(chatMessage);

        Map<String, WebSocketSession> webSocketSessions = this.webSocketSessionRepository
                .findAllByUserIdIn(conversation.getParticipantIds()).stream()
                .collect(Collectors.toMap(WebSocketSession::getSocketSessionId, Function.identity()));

        ChatMessageResponse chatMessageResponse = toChatMessageResponse(chatMessage);

        // Publish socket event to clients
        socketIOServer.getAllClients().forEach(client -> {
            var webSocketSession = webSocketSessions.get(client.getSessionId().toString());

            if (Objects.nonNull(webSocketSession)) {
                String message = null;
                try {
                    chatMessageResponse.setMe(webSocketSession.getUserId().equals(userId));
                    message = objectMapper.writeValueAsString(chatMessageResponse);
                    client.sendEvent("message", message);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
            // client.sendEvent("message", message);

        });

        // convert to Response
        return chatMessageResponse;
    }

    private ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage) {
        UserResponse participantInfo = this.userClient.getUserById(chatMessage.getSender()).getData();
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(chatMessage.getId());
        response.setConversationId(chatMessage.getConversation().getId());
        response.setMessage(chatMessage.getMessage());
        response.setSender(participantInfo);
        response.setCreatedDate(chatMessage.getCreatedDate());
        response.setMe(userId.equals(chatMessage.getSender()));
        return response;
    }

    private ChatMessage toChatMessage(ChatMessageRequest request) {

        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setConversation(this.conversationRepository.findById(request.getConversationId()).get());
        chatMessage.setMessage(request.getMessage());

        return chatMessage;
    }

}
