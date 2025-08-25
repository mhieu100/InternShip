package com.example.chat_service.controller;

import java.util.List;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.chat_service.dto.request.ChatMessageRequest;
import com.example.chat_service.dto.response.ChatMessageResponse;
import com.example.chat_service.service.ChatMessageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/messages")
public class ChatMessageController {

    ChatMessageService chatMessageService;      

    @PostMapping("/create")
    ResponseEntity<ChatMessageResponse> create(@Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatMessageService.create(request));
    }

    @GetMapping
    ResponseEntity<List<ChatMessageResponse>> getMessages(@RequestParam("conversationId") Long conversationId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatMessageService.getMessages(conversationId));
    }
}
