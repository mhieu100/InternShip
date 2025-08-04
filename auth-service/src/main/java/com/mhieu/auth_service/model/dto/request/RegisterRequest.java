package com.mhieu.auth_service.model.dto.request;

import com.mhieu.auth_service.utils.RoleEnum;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "name not empty")
    private String name;
    @NotBlank(message = "email not empty")
    private String email;
    @NotBlank(message = "password not empty")
    private String password;

    private RoleEnum role;
}
