package com.dev.chat_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationGroupRequest {
    @NotBlank(message = "Name group not empty")
    String conversationName;
    @Size(min = 1)
    @NotNull
    List<Long> participantIds;
}
