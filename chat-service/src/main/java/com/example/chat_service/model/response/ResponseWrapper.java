package com.example.chat_service.model.response;

import lombok.Data;

@Data
public class ResponseWrapper<T> {
    private int statusCode;
    private T data;
}
