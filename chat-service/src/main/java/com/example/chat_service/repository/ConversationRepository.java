package com.example.chat_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chat_service.model.Conversation;

import feign.Param;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    boolean existsByParticipantsHash(String userIdHash);

    Optional<Conversation> findByParticipantsHash(String hash);

    @Query("SELECT c FROM Conversation c JOIN c.participantIds p WHERE p = :userId")
    List<Conversation> findAllByParticipantIdsContains(@Param("userId") Long userId);
}
