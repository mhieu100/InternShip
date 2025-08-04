package com.mhieu.auth_service.model.dto.response;

import com.mhieu.auth_service.utils.RoleEnum;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String access_token;
    private UserLogin user;

    @Data
    @Builder
    public static class UserLogin {
        private long id;
        private String email;
        private String name;
        private String address;
        private RoleEnum role;
    }
}
