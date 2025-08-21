package com.dev.chatbot_service.controller;

import com.dev.chatbot_service.dto.request.ChatRequest;
import com.dev.chatbot_service.dto.response.VaccineItem;
import com.dev.chatbot_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping
    public String generate(@RequestBody ChatRequest request) {
        return chatService.generate(request);
    }

//    @PostMapping("/mock-vaccine")
//    public List<VaccineItem> mockVaccine(@RequestBody ChatRequest request) {
//        return chatService.getMockData(request);
//    }

    @PostMapping("/mock-vaccine")
    public VaccineItem mockVaccine(@RequestBody ChatRequest request) {
        return chatService.dataInfo(request);
    }

    @PostMapping("/chat-with-image")
    String chatWithImage(@RequestParam("file") MultipartFile file,
                         @RequestParam("message") String message) {
        return chatService.chatWithImage(file, message);
    }
}
