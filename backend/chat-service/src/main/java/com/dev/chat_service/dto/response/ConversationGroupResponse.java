package com.dev.chat_service.dto.response;

import java.time.Instant;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationGroupResponse {
    Long id;
    String type; 
    String participantsHash;
    String conversationName;
    List<UserResponse> participants;
    Instant createdDate;
    Instant modifiedDate;
}
