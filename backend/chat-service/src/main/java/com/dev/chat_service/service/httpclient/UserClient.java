package com.dev.chat_service.service.httpclient;

import com.dev.chat_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.dev.chat_service.dto.response.UserResponse;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {

    @GetMapping("api/users/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable("id") Long id);



}
