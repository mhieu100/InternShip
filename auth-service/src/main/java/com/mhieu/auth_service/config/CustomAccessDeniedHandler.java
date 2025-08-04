package com.mhieu.auth_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mhieu.auth_service.model.dto.response.RestResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final AccessDeniedHandler delegate = new BearerTokenAccessDeniedHandler();

    private final ObjectMapper mapper;

    public CustomAccessDeniedHandler(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException, ServletException {
        this.delegate.handle(request, response, accessDeniedException);
        response.setContentType("application/json;charset=UTF-8");

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.FORBIDDEN.value());
                
        String errorMessage = Optional.ofNullable(accessDeniedException.getCause()).map(Throwable::getMessage)
                .orElse(accessDeniedException.getMessage());
        res.setMessage("Access denied: You do not have the required role (ADMIN)");
        res.setError(errorMessage);
        mapper.writeValue(response.getWriter(), res);

    }
}
