package com.example.jjwt.model.dto;

import lombok.Data;

@Data
public class ErrorResponse {
    private int statusCode;
    private String error;
}
