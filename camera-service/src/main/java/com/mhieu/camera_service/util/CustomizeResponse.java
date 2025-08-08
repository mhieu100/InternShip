package com.mhieu.camera_service.util;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.mhieu.camera_service.annotation.ApiMessage;
import com.mhieu.camera_service.dto.response.ApiResponse;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class CustomizeResponse implements ResponseBodyAdvice {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        ApiResponse<Object> apiResponse = new ApiResponse<Object>();
        apiResponse.setStatusCode(status);

        if (body instanceof String || body instanceof Resource) {
            return body;
        }

        if (status >= 400) {
            return body;
        } else {
            apiResponse.setData(body);
            ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
            apiResponse.setMessage(message != null ? message.value() : "Update message action for function");
        }

        return apiResponse;
    }
}
