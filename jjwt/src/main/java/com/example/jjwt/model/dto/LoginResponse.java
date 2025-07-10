package com.example.jjwt.model.dto;

import lombok.Data;

@Data
public class LoginResponse {
    String access_token;
    UserResponse user;
}
