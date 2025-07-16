package com.example.chat_service.service.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.chat_service.config.FeignConfig;
import com.example.chat_service.model.response.ResponseWrapper;
import com.example.chat_service.model.response.UserResponse;

@FeignClient(value = "auth-service", url = "${auth.service.url}", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("api/auth/isValid")
    String isValid();

    @GetMapping("api/users/{id}")
    ResponseWrapper<UserResponse> getUserById(@PathVariable("id") Long id);

}
