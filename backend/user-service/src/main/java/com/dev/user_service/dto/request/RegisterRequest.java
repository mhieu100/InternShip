package com.dev.user_service.dto.request;

import com.dev.user_service.utils.RoleEnum;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    @NotBlank(message = "Username not empty")
    private String name;
    @NotBlank(message = "Email not empty")
    private String email;
    @NotBlank(message = "Password not empty")
    private String password;

    private RoleEnum role;
}