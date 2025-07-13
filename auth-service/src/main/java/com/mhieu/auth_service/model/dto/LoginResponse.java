package com.mhieu.auth_service.model.dto;

import com.mhieu.auth_service.utils.RoleEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class LoginResponse {
    private String access_token;
    private UserLogin user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserLogin {
        private long id;
        private String email;
        private String name;
        private RoleEnum role;
    }
}
