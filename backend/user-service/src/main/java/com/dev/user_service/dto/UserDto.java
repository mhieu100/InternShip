package com.dev.user_service.dto;

import com.dev.user_service.utils.RoleEnum;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private RoleEnum role;
}
