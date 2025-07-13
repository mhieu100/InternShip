package com.mhieu.order_service.model.dto;

import com.mhieu.order_service.model.Order;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private String productName;
    private Double price;
    private Integer quantity;
    private UserResponse user; 
    private Double totalPrice;
    private Order.Status status;
}
