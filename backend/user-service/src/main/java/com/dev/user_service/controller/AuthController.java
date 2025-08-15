package com.dev.user_service.controller;

import com.dev.user_service.dto.request.VerifyRequest;
import com.dev.user_service.dto.response.RegisterResponse;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.user_service.anotation.Message;
import com.dev.user_service.dto.request.LoginRequest;
import com.dev.user_service.dto.request.RegisterRequest;
import com.dev.user_service.dto.response.LoginResponse;
import com.dev.user_service.dto.response.LoginResponse.UserLogin;
import com.dev.user_service.dto.response.UserResponse;
import com.dev.user_service.exception.AppException;
import com.dev.user_service.service.AuthService;
import com.dev.user_service.utils.JwtUtil;


import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleLogin(@RequestBody Map<String, String> request)
            throws IOException, GeneralSecurityException {
        String token = request.get("token");
        LoginResponse response = authService.loginGoogle(token);

        String refreshToken = this.jwtUtil.createRefreshToken(response.getUser().getEmail());
        this.authService.updateUserToken(refreshToken, response.getUser().getEmail());
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(10000000)
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/login")
    @Message("login user")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = this.authService.login(request);

        String refreshToken = this.jwtUtil.createRefreshToken(response.getUser().getEmail());
        this.authService.updateUserToken(refreshToken, request.getUsername());
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(10000000)
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @GetMapping("/account")
    @Message("get profile")
    public ResponseEntity<UserLogin> getCurrentUser() throws AppException {
        return ResponseEntity.ok(this.authService.getProfile());
    }

    @PostMapping("/register")
    @Message("register new user")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) throws AppException {
        return ResponseEntity.ok(this.authService.register(request));
    }

    @PostMapping("/verify")
    @Message("verify user")
    public ResponseEntity<UserResponse> verify(@RequestBody VerifyRequest request) throws AppException {
        return ResponseEntity.ok(this.authService.verify(request));
    }

    @PostMapping("/resend-code")
    @Message("resend code")
    public ResponseEntity<Void> resendCode(@RequestBody VerifyRequest request) {
        authService.resendCode(request.getEmail());
        return ResponseEntity.ok(null);
    }

    @GetMapping("/refresh")
    @Message("refresh token")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws AppException {
        LoginResponse response = this.authService.refreshToken(refreshToken);
        String newRefreshToken = this.jwtUtil.createRefreshToken(response.getUser().getEmail());
        this.authService.updateUserToken(newRefreshToken, response.getUser().getEmail());
        ResponseCookie cookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(10000000)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);
    }

    @PostMapping("/logout")
    @Message("logout user")
    public ResponseEntity<Void> logout() throws AppException {

        this.authService.logout();

        ResponseCookie cookie = ResponseCookie.from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }
}
