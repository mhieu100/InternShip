package com.example.order_service.model.dto;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private String productName;
    private Double price;
    private Integer quantity;
    private UserResponse user; 
}
