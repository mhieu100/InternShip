package com.dev.chat_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    CONVERSATION_NOT_FOUND(2001, "Conversation not found", HttpStatus.NOT_FOUND),
    CREATE_CONVERSATION_FAILED(3001, "Create conversation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    CONVERSATION_ALREADY_EXISTS(3002, "Conversation already exists", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}