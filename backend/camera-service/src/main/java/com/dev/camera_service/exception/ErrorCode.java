package com.dev.camera_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    CAMERA_ALREADY_EXISTS(3003, "Camera already exists", HttpStatus.CONFLICT),
    CAMERA_NOT_FOUND(3002, "Camera not found", HttpStatus.NOT_FOUND);

    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}