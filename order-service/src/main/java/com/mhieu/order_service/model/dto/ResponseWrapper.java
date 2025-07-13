package com.mhieu.order_service.model.dto;

import lombok.Data;

@Data
public class ResponseWrapper<T> {
    private int statusCode;
    private T data;
}
