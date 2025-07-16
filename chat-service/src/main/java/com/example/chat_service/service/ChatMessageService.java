package com.example.chat_service.service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.chat_service.exception.AppException;
import com.example.chat_service.exception.ErrorCode;
import com.example.chat_service.model.ChatMessage;
import com.example.chat_service.model.request.ChatMessageRequest;
import com.example.chat_service.model.response.ChatMessageResponse;
import com.example.chat_service.model.response.ResponseWrapper;
import com.example.chat_service.model.response.UserResponse;
import com.example.chat_service.repository.ChatMessageRepository;
import com.example.chat_service.repository.ConversationRepository;
import com.example.chat_service.service.httpclient.UserClient;

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

    public List<ChatMessageResponse> getMessages(Long conversationId) {
        Long userId = Long.parseLong(this.userClient.isValid());

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
        Long userId = Long.parseLong(this.userClient.isValid());
        // Validate conversationId
        this.conversationRepository
                .findById(request.getConversationId())
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND))
                .getParticipantIds()
                .stream()
                .filter(participantInfo -> userId.equals(participantInfo))
                .findAny()
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        ResponseWrapper<UserResponse> userResponse = userClient.getUserById(userId);
        if (Objects.isNull(userResponse)) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        // Build Chat message Info
        ChatMessage chatMessage = toChatMessage(request);
        chatMessage.setSender(userId);
        chatMessage.setCreatedDate(Instant.now());

        // Create chat message
        chatMessage = chatMessageRepository.save(chatMessage);

        String message = chatMessage.getMessage();

        // Publish socket event to clients
        socketIOServer.getAllClients().forEach(client -> {
            client.sendEvent("message", message);
        });

        // convert to Response
        return toChatMessageResponse(chatMessage);
    }

    private ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage) {
        UserResponse participantInfo = this.userClient.getUserById(chatMessage.getSender()).getData();
        Long userId = Long.parseLong(this.userClient.isValid());
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
