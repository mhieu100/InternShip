package com.example.chat_service.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.chat_service.model.request.ConversationRequest;
import com.example.chat_service.model.response.ConversationResponse;
import com.example.chat_service.service.ConversationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/conversations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ConversationController {
    ConversationService conversationService;

    @PostMapping("/create")
    ResponseEntity<ConversationResponse> createConversation(@RequestBody @Valid ConversationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.conversationService.create(request));
    }

    @GetMapping("/my-conversations")
    ResponseEntity<List<ConversationResponse>> myConversations() {
        return ResponseEntity.ok(this.conversationService.myConversations());
    }
}
