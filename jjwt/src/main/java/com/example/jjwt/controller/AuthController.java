package com.example.jjwt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.jjwt.model.User;
import com.example.jjwt.model.dto.LoginRequest;
import com.example.jjwt.model.dto.LoginResponse;
import com.example.jjwt.model.dto.RegisterRequest;
import com.example.jjwt.model.mapper.UserMapper;
import com.example.jjwt.service.UserService;
import com.example.jjwt.utils.JwtUtil;

import io.jsonwebtoken.JwtException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired 
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
       
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtil.generateToken(loginRequest.getUsername());
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setAccess_token(jwt);
            User user = userService.findByUsername(loginRequest.getUsername());
            loginResponse.setUser(userMapper.toResponse(user));
            return ResponseEntity.ok(loginResponse);

       
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        if (jwtUtil.validateToken(token)) {
            String username = jwtUtil.getUsernameFromToken(token);
            return ResponseEntity.ok(username);
        }
        throw new JwtException("Token is invalid or expired");

    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.register(request);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}

