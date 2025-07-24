package com.mhieu.order_service.event;

import com.mhieu.order_service.model.dto.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPlacedEvent {
    private Long orderId;
    private UserResponse user;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double totalPrice;

    
}