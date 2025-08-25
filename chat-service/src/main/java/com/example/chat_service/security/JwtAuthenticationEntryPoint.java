package com.example.chat_service.security;

import java.io.IOException;

import com.example.chat_service.dto.response.ApiResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
                ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                        .statusCode(HttpServletResponse.SC_UNAUTHORIZED)
                        .message("Unauthorized access: " + authException.getMessage())
                        .data(null)
                        .build();
                ObjectMapper objectMapper = new ObjectMapper();
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
