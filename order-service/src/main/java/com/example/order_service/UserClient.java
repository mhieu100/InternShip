package com.example.order_service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.order_service.model.dto.ResponseWrapper;
import com.example.order_service.model.dto.UserResponse;

@FeignClient(value = "jjwt", url = "${auth.service.url}")
public interface UserClient {
    
    @GetMapping("api/users/{username}")
    ResponseWrapper<UserResponse> getUserByUsername(@PathVariable("username") String username);

    @GetMapping("auth/validate")
    String validate();
}
