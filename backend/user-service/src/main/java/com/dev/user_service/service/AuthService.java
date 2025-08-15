package com.dev.user_service.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

import com.dev.user_service.dto.request.VerifyRequest;
import com.dev.user_service.dto.response.RegisterResponse;
import com.dev.user_service.dto.response.UserResponse;
import com.dev.user_service.event.SendCodeEvent;
import com.dev.user_service.redis.VerifyCodeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.user_service.dto.request.LoginRequest;
import com.dev.user_service.dto.request.RegisterRequest;
import com.dev.user_service.dto.response.LoginResponse;
import com.dev.user_service.dto.response.LoginResponse.UserLogin;
import com.dev.user_service.exception.AppException;
import com.dev.user_service.exception.ErrorCode;
import com.dev.user_service.model.User;
import com.dev.user_service.repository.UserRepository;
import com.dev.user_service.utils.JwtUtil;
import com.dev.user_service.utils.RoleEnum;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final KafkaTemplate<String, SendCodeEvent> kafkaTemplate;
    private final VerifyCodeService verifyCodeService;

    @Value("google.client-id")
    private String googleClientId;

    public LoginResponse loginGoogle(String token) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory())
                .setAudience(Collections
                        .singletonList("870851234800-qlpc3aa55r78vna6ae83ub6guhsp5bc3.apps.googleusercontent.com"))
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String jwtToken = jwtUtil.createAccessToken(user.get());

            LoginResponse.UserLogin userLogin = LoginResponse.UserLogin.builder().id(user.get().getId())
                    .email(user.get().getEmail())
                    .name(user.get().getName())
                    .role(user.get().getRole())
                    .build();
            return LoginResponse.builder()
                    .access_token(jwtToken)
                    .user(userLogin)
                    .build();
        } else {
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .role(RoleEnum.USER)
                    .build();
            userRepository.save(newUser);
            String jwtToken = jwtUtil.createAccessToken(newUser);
            return LoginResponse.builder()
                    .access_token(jwtToken)
                    .user(LoginResponse.UserLogin.builder()
                            .id(newUser.getId())
                            .email(newUser.getEmail())
                            .name(newUser.getName())
                            .role(newUser.getRole())
                            .build())
                    .build();
        }

    }

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
        return LoginResponse.builder().access_token(accessToken).user(userLogin).build();
    }

    public RegisterResponse register(RegisterRequest request) throws AppException {

        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }

        int codeVerification = (int) (Math.random() * 900000) + 100000;

        SendCodeEvent event = SendCodeEvent.builder()
                .email(request.getEmail())
                .code(codeVerification)
                .build();

        kafkaTemplate.send("send-code-topic", event);
        System.out.println("📤 Đã gửi Kafka event: " + event);

        verifyCodeService.saveVerifyCode(request.getEmail(), String.valueOf(codeVerification), 1);

        return RegisterResponse.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
    }

    public UserResponse verify(VerifyRequest request) throws AppException {
        String storedCode = verifyCodeService.getVerifyCode(request.getEmail());
        if (storedCode == null || !storedCode.equals(String.valueOf(request.getCode()))) {
            throw new AppException(ErrorCode.INVALID_VERIFY_CODE);
        }
        verifyCodeService.deleteVerifyCode(request.getEmail());
        User user = User.builder().email(request.getEmail()).name(request.getName()).password(passwordEncoder.encode(request.getPassword())).build();
        return UserResponse.builder()
                .id(userRepository.save(user).getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    public void resendCode (String email) {
        int codeVerification = (int) (Math.random() * 900000) + 100000;

        SendCodeEvent event = SendCodeEvent.builder()
                .email(email)
                .code(codeVerification)
                .build();

        kafkaTemplate.send("send-code-topic", event);
        System.out.println("📤 Đã gửi Kafka event: " + event);

        verifyCodeService.deleteVerifyCode(email);
        verifyCodeService.saveVerifyCode(email, String.valueOf(codeVerification), 1);
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
