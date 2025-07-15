package com.mhieu.auth_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.exception.ErrorCode;
import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.LoginRequest;
import com.mhieu.auth_service.model.dto.LoginResponse;
import com.mhieu.auth_service.model.dto.LoginResponse.UserLogin;
import com.mhieu.auth_service.model.mapper.UserMapper;
import com.mhieu.auth_service.repository.UserRepository;
import com.mhieu.auth_service.model.dto.RegisterRequest;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.utils.JwtUtil;
import com.mhieu.auth_service.utils.RoleEnum;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${mhieu.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthService(AuthenticationManagerBuilder authenticationManagerBuilder, UserRepository userRepository,
            JwtUtil jwtUtil, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest loginRequest) throws AppException {
        log.info("Login attempt for user: {}", loginRequest.getUsername());
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = this.userRepository.findByEmail(loginRequest.getUsername());
        if (user == null) {
            log.warn("User not found during login: {}", loginRequest.getUsername());
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        LoginResponse.UserLogin userLogin = UserLogin.builder().id(user.getId()).email(user.getEmail())
                .name(user.getName()).role(user.getRole()).build();
        String accessToken = this.jwtUtil.createAccessToken(user.getEmail(), userLogin);

        LoginResponse response = LoginResponse.builder().access_token(accessToken).user(userLogin).build();

        log.info("Login successful for user: {}", user.getEmail());

        return response;
    }

    public UserLogin getProfile() throws AppException {
        String email = JwtUtil.getCurrentUserLogin().orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        User user = this.userRepository.findByEmail(email);
        return UserLogin.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
                .role(user.getRole()).build();
    }

    public LoginResponse refreshToken(String refreshToken) throws AppException {
        log.info("Refreshing token");
        if (refreshToken.isEmpty()) {
            log.warn("Missing refresh token in cookies");
            throw new AppException(ErrorCode.MISSING_REFRESH_TOKEN);
        }

        Jwt decoded = jwtUtil.checkValidRefreshToken(refreshToken);
        String email = decoded.getSubject();
        User user = this.userRepository.findByRefreshTokenAndEmail(refreshToken, email);
        if (user == null) {
            log.warn("Invalid refresh token for email: {}", email);
            throw new AppException(ErrorCode.INVALID_ACCESS_TOKEN);
        }

        LoginResponse.UserLogin userLogin = UserLogin.builder().id(user.getId()).email(user.getEmail())
                .name(user.getName()).role(user.getRole()).build();
        String newAccessToken = jwtUtil.createAccessToken(email, userLogin);

        log.info("Refresh token successful for user: {}", email);
        return LoginResponse.builder().access_token(newAccessToken).user(userLogin).build();
    }

    public UserResponse register(RegisterRequest request) throws AppException {
        log.info("Registering user with email: {}", request.getEmail());

        if (this.userRepository.existsByEmail(request.getEmail())) {
            log.warn("Attempted to register with existing email: {}", request.getEmail());
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }

        request.setPassword(this.passwordEncoder.encode(request.getPassword()));
        log.info("Registration successful for user: {}", request.getEmail());
        request.setRole(RoleEnum.USER);
        return this.userMapper.toResponse(this.userRepository.save(userMapper.dtoToEntity(request)));
    }

    public void logout() {
        String email = JwtUtil.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_ACCESS_TOKEN));

        log.info("Logging out user: {}", email);
        User user = this.userRepository.findByEmail(email);
        user.setRefreshToken(null);
        this.userRepository.save(user);
    }
}
