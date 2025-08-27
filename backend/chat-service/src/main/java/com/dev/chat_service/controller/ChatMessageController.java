package com.dev.chat_service.controller;

import java.util.List;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.chat_service.dto.request.ChatMessageRequest;
import com.dev.chat_service.dto.response.ChatMessageResponse;
import com.dev.chat_service.service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/create")
    ResponseEntity<ChatMessageResponse> create(@Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatMessageService.create(request));
    }

    @GetMapping
    ResponseEntity<List<ChatMessageResponse>> getMessages(@RequestParam("conversationId") Long conversationId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatMessageService.getMessages(conversationId));
    }
}
