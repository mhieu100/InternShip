package com.dev.chat_service.model;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "websocket_session")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSocketSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String socketSessionId;
    Long userId;
    Instant createdAt;
}
