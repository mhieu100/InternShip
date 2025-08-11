package com.dev.user_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username not empty")
    private String username;
    @NotBlank(message = "Password not empty")
    private String password;
}