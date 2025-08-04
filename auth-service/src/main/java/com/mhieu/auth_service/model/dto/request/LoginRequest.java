package com.mhieu.auth_service.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "username not empty")
    private String username;
    @NotBlank(message = "password not empty")
    private String password;
}
