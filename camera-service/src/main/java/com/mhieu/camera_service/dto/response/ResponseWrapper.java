package com.mhieu.camera_service.dto.response;

import lombok.Data;

@Data
public class ResponseWrapper<T> {
    private int statusCode;
    private T data;
}
