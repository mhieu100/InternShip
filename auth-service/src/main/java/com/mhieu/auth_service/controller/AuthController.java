package com.mhieu.auth_service.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.mhieu.auth_service.annotation.Message;
import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.model.dto.LoginRequest;
import com.mhieu.auth_service.model.dto.LoginResponse;
import com.mhieu.auth_service.model.dto.RegisterRequest;
import com.mhieu.auth_service.model.dto.TokenRequest;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.model.dto.LoginResponse.UserLogin;
import com.mhieu.auth_service.service.AuthService;
import com.mhieu.auth_service.service.UserService;
import com.mhieu.auth_service.utils.JwtUtil;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final AuthService authService;

    @Value("${mhieu.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(
            JwtUtil jwtUtil,
            UserService userService,
            AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/login")
    @Message("login user")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) throws AppException {
        LoginResponse response = this.authService.login(loginRequest);

        String refreshToken = this.jwtUtil.createRefreshToken(loginRequest.getUsername(), response.getUser());
        this.userService.updateUserToken(refreshToken, loginRequest.getUsername());
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @GetMapping("/account")
    @Message("get profile")
    public ResponseEntity<UserLogin> getCurrentUser() throws AppException {
        return ResponseEntity.ok(this.authService.getProfile());
    }

    @GetMapping("/refresh")
    @Message("refresh token")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws AppException {
        LoginResponse response = this.authService.refreshToken(refreshToken);
        String newRefreshToken = this.jwtUtil.createRefreshToken(response.getUser().getEmail(), response.getUser());
        this.userService.updateUserToken(newRefreshToken, response.getUser().getEmail());
        ResponseCookie cookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
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

    @PostMapping("/register")
    @Message("register new user")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) throws AppException {
        return ResponseEntity.status(201).body(this.authService.register(request));
    }

    @GetMapping("/isValid")
    @Message("check token to access url other service")
    public String isValid(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Jwt decoded = jwtUtil.checkValidRefreshToken(token);
        String email = decoded.getSubject();
        Long userId = userService.getUserByEmail(email).getId();
        log.debug("isValid check passed for user: {}", email);
        return String.valueOf(userId);
    }

    @PostMapping("/chat")
    @Message("check chat create websocket session")
    public String chatChecker(@RequestBody TokenRequest request) {
        Jwt decoded = jwtUtil.checkValidRefreshToken(request.getToken());
        String email = decoded.getSubject();
        Long userId = userService.getUserByEmail(email).getId();
        log.debug("isValid check passed for user: {}", email);
        return String.valueOf(userId);
    }

    @GetMapping("/isAdmin")
    @Message("check admin to access url permisstion admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String isAdmin(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Jwt decoded = jwtUtil.checkValidRefreshToken(token);
        String email = decoded.getSubject();
        Long userId = userService.getUserByEmail(email).getId();
        log.debug("isAdmin check passed for admin user: {}", email);
        return String.valueOf(userId);
    }

}
