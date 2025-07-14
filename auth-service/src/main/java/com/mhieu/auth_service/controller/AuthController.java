package com.mhieu.auth_service.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.mhieu.auth_service.annotation.Message;
import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.LoginRequest;
import com.mhieu.auth_service.model.dto.LoginResponse;
import com.mhieu.auth_service.model.dto.RegisterRequest;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.service.UserService;
import com.mhieu.auth_service.utils.JwtUtil;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Value("${mhieu.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder,
            JwtUtil jwtUtil,
            UserService userService,
            PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Message("login user")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) throws AppException {
        log.info("Login attempt for user: {}", loginRequest.getUsername());

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userService.getUserByEmail(loginRequest.getUsername());
        if (user == null) {
            log.warn("User not found during login: {}", loginRequest.getUsername());
            throw new AppException("Invalid credentials");
        }

        LoginResponse.UserLogin userLogin = buildUserLogin(user);
        String accessToken = jwtUtil.createAccessToken(user.getEmail(), userLogin);
        String refreshToken = jwtUtil.createRefreshToken(user.getEmail(), userLogin);
        userService.updateUserToken(refreshToken, user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setUser(userLogin);
        response.setAccess_token(accessToken);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();
        log.info("Login successful for user: {}", user.getEmail());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);
    }

    @GetMapping("/account")
    @Message("get profile")
    public ResponseEntity<LoginResponse.UserLogin> getCurrentUser() throws AppException {
        String email = JwtUtil.getCurrentUserLogin().orElseThrow(() -> new AppException("No authenticated user"));
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(buildUserLogin(user));
    }

    @GetMapping("/refresh")
    @Message("refresh token")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws AppException {
        log.info("Refreshing token");
        if (refreshToken.isEmpty()) {
            log.warn("Missing refresh token in cookies");
            throw new AppException("Missing refresh token");
        }

        Jwt decoded = jwtUtil.checkValidRefreshToken(refreshToken);
        String email = decoded.getSubject();
        User user = userService.getUserByRefreshTokenAndEmail(refreshToken, email);
        if (user == null) {
            log.warn("Invalid refresh token for email: {}", email);
            throw new AppException("Invalid refresh token");
        }

        LoginResponse.UserLogin userLogin = buildUserLogin(user);
        String newAccessToken = jwtUtil.createAccessToken(email, userLogin);
        String newRefreshToken = jwtUtil.createRefreshToken(email, userLogin);
        userService.updateUserToken(newRefreshToken, email);

        LoginResponse response = new LoginResponse();
        response.setUser(userLogin);
        response.setAccess_token(newAccessToken);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        log.info("Refresh token successful for user: {}", email);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);
    }

    @PostMapping("/logout")
    @Message("logout user")
    public ResponseEntity<Void> logout() throws AppException {
        String email = JwtUtil.getCurrentUserLogin().orElseThrow(() -> new AppException("Invalid access token"));

        log.info("Logging out user: {}", email);
        userService.updateUserToken(null, email);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    @GetMapping("/isValid")
    @Message("check token")
    public String isValid(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Jwt decoded = jwtUtil.checkValidRefreshToken(token);
        String email = decoded.getSubject();
        Long userId = userService.getUserByEmail(email).getId();
        log.debug("isValid check passed for user: {}", email);
        return String.valueOf(userId);
    }

    @GetMapping("/isAdmin")
    @Message("check admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String isAdmin(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Jwt decoded = jwtUtil.checkValidRefreshToken(token);
        String email = decoded.getSubject();
        Long userId = userService.getUserByEmail(email).getId();
        log.debug("isAdmin check passed for admin user: {}", email);
        return String.valueOf(userId);
    }

    @PostMapping("/register")
    @Message("register new user")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) throws AppException {
        log.info("Registering user with email: {}", request.getEmail());

        if (userService.existsByEmail(request.getEmail())) {
            log.warn("Attempted to register with existing email: {}", request.getEmail());
            throw new AppException("Email already in use.");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        UserResponse response = userService.register(request);
        log.info("Registration successful for user: {}", request.getEmail());

        return ResponseEntity.status(201).body(response);
    }

    private LoginResponse.UserLogin buildUserLogin(User user) {
        return new LoginResponse.UserLogin(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole());
    }

}
