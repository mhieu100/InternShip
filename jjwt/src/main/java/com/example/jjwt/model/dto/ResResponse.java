package com.example.jjwt.model.dto;

import lombok.Data;

@Data
public class ResResponse<T> {
    private int status;
    private T data;
}
