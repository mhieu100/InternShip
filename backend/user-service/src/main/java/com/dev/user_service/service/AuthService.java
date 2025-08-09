package com.dev.user_service.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dev.user_service.dto.request.LoginRequest;
import com.dev.user_service.dto.request.RegisterRequest;
import com.dev.user_service.dto.response.LoginResponse;
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        User loggedInUser = user;

        LoginResponse.UserLogin userLogin = LoginResponse.UserLogin.builder().id(loggedInUser.getId())
                .email(loggedInUser.getEmail())
                .name(loggedInUser.getName())
                .role(loggedInUser.getRole())
                .build();
        String accessToken = this.jwtUtil.createAccessToken(loggedInUser);

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

    public void updateUserToken(String token, String email) {
        Optional<User> currentUser = this.userRepository.findByEmail(email);
        if (currentUser.isPresent()) {
            currentUser.get().setRefreshToken(token);
            this.userRepository.save(currentUser.get());
        }
    }
}
