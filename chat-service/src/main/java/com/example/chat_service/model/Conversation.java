package com.example.chat_service.model;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "conversation")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "type") // GROUP, DIRECT
    String type;

    @Column(name = "participants_hash")
    String participantsHash;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "conversation_participants", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "user_id")
    List<Long> participantIds;

    @Column(name = "created_date")
    Instant createdDate;

    @Column(name = "modified_date")
    Instant modifiedDate;
}
