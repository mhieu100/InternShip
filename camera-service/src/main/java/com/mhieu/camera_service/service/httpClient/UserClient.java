package com.mhieu.camera_service.service.httpClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.mhieu.camera_service.dto.response.ResponseWrapper;
import com.mhieu.camera_service.dto.response.UserResponse;
import com.mhieu.camera_service.feign.FeignConfig;

@FeignClient(value = "auth-service", url = "${auth.service.url}", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("api/users/{id}")
    ResponseWrapper<UserResponse> getUserById(@PathVariable("id") Long id);

    @GetMapping("api/auth/isValid")
    String isValid();

    @GetMapping("api/auth/isAdmin")
    String isAdmin();
}
