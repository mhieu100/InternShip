package com.example.order_service.model.dto;

import lombok.Data;

@Data
public class ResponseWrapper<T> {
    private int status;
    private T data;
}
