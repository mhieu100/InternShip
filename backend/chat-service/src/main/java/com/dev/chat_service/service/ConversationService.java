package com.dev.chat_service.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.dev.chat_service.dto.response.*;
import com.dev.chat_service.dto.response.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dev.chat_service.exception.AppException;
import com.dev.chat_service.exception.ErrorCode;
import com.dev.chat_service.model.Conversation;
import com.dev.chat_service.dto.request.ConversationGroupRequest;
import com.dev.chat_service.dto.request.ConversationSingleRequest;
import com.dev.chat_service.repository.ConversationRepository;
import com.dev.chat_service.service.httpclient.UserClient;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserClient userClient;


    public List<ConversationResponse> myConversations() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Conversation> conversations = conversationRepository.findAllByParticipantIdsContains(userId);
        if(conversations.isEmpty()) {
            throw new AppException(ErrorCode.CONVERSATION_NOT_FOUND);
        }
        return conversations.stream().map(this::toConversationResponse).toList();
    }

    public ConversationGroupResponse createGroup(ConversationGroupRequest request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApiResponse<UserResponse> userAuth = userClient.getUserById(userId);

        List<UserResponse> listParticipants = new ArrayList<>();
        List<Long> ids = request.getParticipantIds();

        for (Long id : ids) {
            UserResponse user = userClient.getUserById(id).getData();
            listParticipants.add(user);
        }

        // ApiResponse<UserResponse> userParticipant = userClient.getUserById(
        // request.getParticipantIds().get(0));

        // if (Objects.isNull(userAuth) || Objects.isNull(userParticipant)) {
        // throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        // }

        if (Objects.isNull(userAuth) || listParticipants.isEmpty()) {
            throw new AppException(ErrorCode.CREATE_CONVERSATION_FAILED);
        }
        UserResponse userInfo = userAuth.getData();
        // UserResponse participantInfo = userParticipant.getData();

        List<String> userIds = new ArrayList<>();
        userIds.add(String.valueOf(userId));
        // userIds.add(String.valueOf(userParticipant.getData().getId()));
        for (Long participantId : ids) {
            userIds.add(String.valueOf(participantId));
        }

        var sortedIds = userIds.stream().sorted().toList();
        String userIdHash = generateParticipantHash(sortedIds);

        Conversation conversation = this.conversationRepository
                .findByParticipantsHash(userIdHash)
                .orElseGet(() -> {
                    // List<Long> participantIds = List.of(userInfo.getId(),
                    // participantInfo.getId());
                    List<Long> participantIds = new ArrayList<>();
                    participantIds.add(userInfo.getId());
                    participantIds.addAll(ids);

                    // Build conversation info
                    Conversation newConversation = Conversation.builder()
                            .type("GROUP")
                            .participantsHash(userIdHash)
                            .createdDate(Instant.now())
                            .modifiedDate(Instant.now())
                            .conversationName(request.getConversationName())
                            .participantIds(participantIds)
                            .build();

                    return conversationRepository.save(newConversation);
                });

        return toConversationGroupResponse(conversation);
    }

    public ConversationSingleResponse createSingle(ConversationSingleRequest request) {
        System.out.println(request);
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApiResponse<UserResponse> userAuth = userClient.getUserById(userId);
        ApiResponse<UserResponse> userParticipant = userClient.getUserById(
                request.getParticipantId());

        if (Objects.isNull(userAuth) || Objects.isNull(userParticipant)) {
            throw new AppException(ErrorCode.CREATE_CONVERSATION_FAILED);
        }

        UserResponse userInfo = userAuth.getData();
        UserResponse participantInfo = userParticipant.getData();

        List<String> userIds = new ArrayList<>();
        userIds.add(String.valueOf(userId));
        userIds.add(String.valueOf(userParticipant.getData().getId()));

        var sortedIds = userIds.stream().sorted().toList();
        String userIdHash = generateParticipantHash(sortedIds);

        boolean converExists = this.conversationRepository
                .existsByParticipantsHash(userIdHash);

        if (converExists) {
            throw new AppException(ErrorCode.CONVERSATION_ALREADY_EXISTS);
        }

        Conversation conversation = this.conversationRepository
                .findByParticipantsHash(userIdHash)
                .orElseGet(() -> {
                    List<Long> participantIds = List.of(userInfo.getId(),
                            participantInfo.getId());

                    // Build conversation info
                    Conversation newConversation = Conversation.builder()
                            .type("DIRECT")
                            .participantsHash(userIdHash)
                            .createdDate(Instant.now())
                            .modifiedDate(Instant.now())
                            .participantIds(participantIds)
                            .build();

                    return conversationRepository.save(newConversation);
                });

        return toConversationSingleResponse(conversation);
    }

    private String generateParticipantHash(List<String> ids) {
        String joined = String.join("_", ids);
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(joined.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private ConversationResponse toConversationResponse(Conversation conversation) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ConversationResponse conversationResponse = new ConversationResponse();
        conversationResponse.setId(conversation.getId());
        conversationResponse.setType(conversation.getType());

        conversationResponse.setCreatedDate(conversation.getCreatedDate());
        conversationResponse.setModifiedDate(conversation.getModifiedDate());
        conversationResponse.setParticipantsHash(conversation.getParticipantsHash());

        List<UserResponse> listParticipant = new ArrayList();
        for (Long userId : conversation.getParticipantIds()) {
            UserResponse userResponse = this.userClient.getUserById(userId).getData();
            listParticipant.add(userResponse);
        }
        conversationResponse.setParticipants(listParticipant);

        if (conversation.getType().equals("DIRECT")) {
            conversation.getParticipantIds().stream()
                    .filter(participantId -> !participantId.equals(currentUserId))
                    .findFirst()
                    .ifPresent(participantId -> {
                        UserResponse participantInfo = this.userClient.getUserById(participantId).getData();
                        conversationResponse.setConversationName(participantInfo.getName());
                    });
        } else {
            conversationResponse.setConversationName(conversation.getConversationName());
        }

        return conversationResponse;
    }

    private ConversationSingleResponse toConversationSingleResponse(Conversation conversation) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ConversationSingleResponse conversationResponse = new ConversationSingleResponse();
        conversationResponse.setId(conversation.getId());
        conversationResponse.setType(conversation.getType());

        conversationResponse.setCreatedDate(conversation.getCreatedDate());
        conversationResponse.setModifiedDate(conversation.getModifiedDate());
        conversationResponse.setParticipantsHash(conversation.getParticipantsHash());
        List<UserResponse> listParticipant = new ArrayList<>();
        for (Long userId : conversation.getParticipantIds()) {
            UserResponse userResponse = this.userClient.getUserById(userId).getData();
            listParticipant.add(userResponse);
        }
        conversationResponse.setParticipants(listParticipant);
        conversation.getParticipantIds().stream()
                .filter(participantId -> !participantId.equals(currentUserId))
                .findFirst()
                .ifPresent(participantId -> {
                    UserResponse participantInfo = this.userClient.getUserById(participantId).getData();
                    conversationResponse.setConversationName(participantInfo.getName());
                });

        return conversationResponse;
    }

    private ConversationGroupResponse toConversationGroupResponse(Conversation conversation) {

        ConversationGroupResponse conversationResponse = new ConversationGroupResponse();
        conversationResponse.setId(conversation.getId());
        conversationResponse.setType(conversation.getType());

        conversationResponse.setCreatedDate(conversation.getCreatedDate());
        conversationResponse.setModifiedDate(conversation.getModifiedDate());
        conversationResponse.setParticipantsHash(conversation.getParticipantsHash());
        List<UserResponse> listParticipant = new ArrayList();
        for (Long userId : conversation.getParticipantIds()) {
            UserResponse userResponse = this.userClient.getUserById(userId).getData();
            listParticipant.add(userResponse);
        }
        conversationResponse.setParticipants(listParticipant);
        conversationResponse.setConversationName(conversation.getConversationName());

        return conversationResponse;
    }
}
