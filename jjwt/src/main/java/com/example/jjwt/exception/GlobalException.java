package com.example.jjwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.jjwt.model.dto.ErrorResponse;

@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = {AppException.class})
    public ResponseEntity<ErrorResponse> handelAppException(Exception ex) {

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
        errorResponse.setError(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
