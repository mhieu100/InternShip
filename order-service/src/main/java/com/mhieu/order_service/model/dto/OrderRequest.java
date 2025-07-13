package com.mhieu.order_service.model.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String productName;
    private Double price;
    private Integer quantity;
    private Long userId; 
}
