package com.example.jjwt.config;

import java.io.IOException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import com.example.jjwt.model.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.*;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); 
        response.setContentType("application/json");
         ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatusCode(HttpServletResponse.SC_FORBIDDEN);
        errorResponse.setError("Forbidden: " + accessDeniedException.getMessage());
        String json = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(json);
    }
}
