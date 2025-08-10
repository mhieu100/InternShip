package com.dev.user_service.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.user_service.dto.request.LoginRequest;
import com.dev.user_service.dto.request.RegisterRequest;
import com.dev.user_service.dto.response.LoginResponse;
import com.dev.user_service.dto.response.LoginResponse.UserLogin;
import com.dev.user_service.dto.response.UserResponse;
import com.dev.user_service.exception.AppException;
import com.dev.user_service.exception.ErrorCode;
import com.dev.user_service.model.User;
import com.dev.user_service.repository.UserRepository;
import com.dev.user_service.utils.JwtUtil;
import com.dev.user_service.utils.RoleEnum;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) throws AppException {
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        LoginResponse.UserLogin userLogin = LoginResponse.UserLogin.builder().id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
        String accessToken = this.jwtUtil.createAccessToken(user);

        LoginResponse response = LoginResponse.builder().access_token(accessToken).user(userLogin).build();

        return response;
    }

    public UserResponse register(RegisterRequest request) throws AppException {

        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }

        request.setPassword(this.passwordEncoder.encode(request.getPassword()));
        request.setRole(RoleEnum.USER);
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return UserResponse.builder()
                .id(userRepository.save(user).getId())
                .name(request.getName())
                .email(request.getEmail())
                .role(request.getRole())
                .build();
    }

    public UserLogin getProfile() throws AppException {
        Long userId = jwtUtil.getCurrentUserId();
        User user = this.userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        return UserLogin.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }

    public void updateUserToken(String token, String email) {
        Optional<User> currentUser = this.userRepository.findByEmail(email);
        if (currentUser.isPresent()) {
            currentUser.get().setRefreshToken(token);
            this.userRepository.save(currentUser.get());
        }
    }

    public LoginResponse refreshToken(String refreshToken) throws AppException {
        if (refreshToken.isEmpty()) {
            throw new AppException(ErrorCode.MISSING_REFRESH_TOKEN);
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = this.userRepository.findByRefreshTokenAndEmail(refreshToken, email);
        if (user == null) {
            throw new AppException(ErrorCode.INVALID_ACCESS_TOKEN);
        }

        LoginResponse.UserLogin userLogin = UserLogin.builder().id(user.getId()).email(user.getEmail())
                .name(user.getName()).role(user.getRole()).build();
        String newAccessToken = jwtUtil.createAccessToken(user);

        return LoginResponse.builder().access_token(newAccessToken).user(userLogin).build();
    }

    public void logout() {
        Long userId = jwtUtil.getCurrentUserId();

        Optional<User> user = this.userRepository.findById(userId);
        user.ifPresent(u -> {
            u.setRefreshToken(null);
            this.userRepository.save(u);
        });
    }
}
