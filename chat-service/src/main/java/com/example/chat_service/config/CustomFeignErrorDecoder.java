package com.example.chat_service.config;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import feign.Response;
import feign.Util;
import feign.codec.ErrorDecoder;

@Component
public class CustomFeignErrorDecoder implements ErrorDecoder {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        try {
            // Đọc body JSON lỗi trả về từ auth-service
            String body = Util.toString(response.body().asReader());

            // Ví dụ auth-service trả: {"statusCode":401, "error":"Unauthorized"}
            JsonNode root = objectMapper.readTree(body);

            int statusCode = root.path("statusCode").asInt(response.status());
            String error = root.path("error").asText("Unknown error");
            String message = root.path("message").asText("No message available");

            return new FeignClientException(statusCode, message, error);

        } catch (Exception e) {
            return defaultDecoder.decode(methodKey, response);
        }
    }
}
