package com.example.chat_service.dto.response;

import java.time.Instant;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageResponse {
    Long id;
    Long conversationId;
    boolean me;
    String message;
    UserResponse sender;
    Instant createdDate;
}
