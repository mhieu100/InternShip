package com.dev.user_service.dto;

import com.dev.user_service.model.User;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
}
