package com.dev.user_service.dto.request;

import com.dev.user_service.utils.RoleEnum;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    @NotBlank(message = "Name is required")
    String name;
    @NotBlank(message = "Email is required")
    String email;
    String address;
    RoleEnum role;
}
