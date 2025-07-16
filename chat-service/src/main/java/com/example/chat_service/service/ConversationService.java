package com.example.chat_service.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.StringJoiner;

import org.springframework.stereotype.Service;

import com.example.chat_service.exception.AppException;
import com.example.chat_service.exception.ErrorCode;
import com.example.chat_service.model.Conversation;
import com.example.chat_service.model.request.ConversationRequest;
import com.example.chat_service.model.response.ConversationResponse;
import com.example.chat_service.model.response.ResponseWrapper;
import com.example.chat_service.model.response.UserResponse;
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
public class ConversationService {
    ConversationRepository conversationRepository;
    UserClient userClient;

    // ConversationMapper conversationMapper;

    public List<ConversationResponse> myConversations() {
        Long userId = Long.parseLong(this.userClient.isValid());
        List<Conversation> conversations = conversationRepository.findAllByParticipantIdsContains(userId);

        return conversations.stream().map(this::toConversationResponse).toList();
    }

    public ConversationResponse create(ConversationRequest request) {
        Long userId = Long.parseLong(this.userClient.isValid());
        ResponseWrapper<UserResponse> userAuth = userClient.getUserById(userId);
        ResponseWrapper<UserResponse> userParticipant = userClient.getUserById(
                request.getParticipantIds().get(0));

        if (Objects.isNull(userAuth) || Objects.isNull(userParticipant)) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        UserResponse userInfo = userAuth.getData();
        UserResponse participantId = userParticipant.getData();

        List<String> userIds = new ArrayList<>();
        userIds.add(String.valueOf(userId));
        userIds.add(String.valueOf(userParticipant.getData().getId()));

        var sortedIds = userIds.stream().sorted().toList();
        String userIdHash = generateParticipantHash(sortedIds);

        Conversation conversation = this.conversationRepository
                .findByParticipantsHash(userIdHash)
                .orElseGet(() -> {
                    List<Long> participantIds = List.of(userInfo.getId(), participantId.getId());

                    // Build conversation info
                    Conversation newConversation = Conversation.builder()
                            .type(request.getType())
                            .participantsHash(userIdHash)
                            .createdDate(Instant.now())
                            .modifiedDate(Instant.now())
                            .participantIds(participantIds)
                            .build();

                    return conversationRepository.save(newConversation);
                });

        return toConversationResponse(conversation);
    }

    private String generateParticipantHash(List<String> ids) {
        StringJoiner stringJoiner = new StringJoiner("_");
        ids.forEach(stringJoiner::add);
        return stringJoiner.toString();
    }

    private ConversationResponse toConversationResponse(Conversation conversation) {
        Long currentUserId = Long.parseLong(this.userClient.isValid());

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
        conversation.getParticipantIds().stream()
                .filter(participantId -> !participantId.equals(currentUserId))
                .findFirst()
                .ifPresent(participantId -> {
                    UserResponse participantInfo = this.userClient.getUserById(participantId).getData();
                    conversationResponse.setConversationName(participantInfo.getName());
                    conversationResponse.setConversationEmail(participantInfo.getEmail());
                });

        return conversationResponse;
    }
}
