package com.example.chat_service.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.chat_service.annotation.Message;
import com.example.chat_service.dto.request.ConversationGroupRequest;
import com.example.chat_service.dto.request.ConversationSingleRequest;
import com.example.chat_service.dto.response.ConversationGroupResponse;
import com.example.chat_service.dto.response.ConversationResponse;
import com.example.chat_service.dto.response.ConversationSingleResponse;
import com.example.chat_service.service.ConversationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    @PostMapping("/create-single")
    @Message("create new single chat")
    ResponseEntity<ConversationSingleResponse> createConversationSingle(
            @RequestBody @Valid ConversationSingleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.conversationService.createSingle(request));
    }

    @PostMapping("/create-group")
    ResponseEntity<ConversationGroupResponse> createConversationGroup(
            @RequestBody @Valid ConversationGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.conversationService.createGroup(request));
    }

    @GetMapping("/my-conversations")
    ResponseEntity<List<ConversationResponse>> myConversations() {
        return ResponseEntity.ok(this.conversationService.myConversations());
    }
}
