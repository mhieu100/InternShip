package com.dev.order_service.dto.response;

import com.dev.order_service.dto.UserDto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private String product;
    private Double price;
    private UserDto user;
}
