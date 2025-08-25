package com.example.chat_service.service.httpclient;

import com.example.chat_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.chat_service.dto.request.TokenRequest;
import com.example.chat_service.dto.response.UserResponse;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {

    @PostMapping("api/auth/chat")
    String chatChecker(@RequestBody TokenRequest request);

    @GetMapping("api/users/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable("id") Long id);



}
