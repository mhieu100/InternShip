package com.mhieu.order_service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.mhieu.order_service.config.FeignConfig;
import com.mhieu.order_service.model.dto.ResponseWrapper;
import com.mhieu.order_service.model.dto.UserResponse;

@FeignClient(value = "auth-service", url = "${auth.service.url}", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("api/users/{id}")
    ResponseWrapper<UserResponse> getUserById(@PathVariable("id") Long id);

    @GetMapping("api/auth/isValid")
    String isValid();

    @GetMapping("api/auth/isAdmin")
    String isAdmin();
}
