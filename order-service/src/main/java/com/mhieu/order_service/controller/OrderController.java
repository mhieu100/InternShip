package com.mhieu.order_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhieu.order_service.UserClient;
import com.mhieu.order_service.exception.AppException;
import com.mhieu.order_service.model.Order;
import com.mhieu.order_service.model.dto.OrderRequest;
import com.mhieu.order_service.model.dto.OrderResponse;
import com.mhieu.order_service.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final UserClient userClient;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        userClient.isValid();
        log.info("Creating order for userId: {}", orderRequest.getUserId());
        OrderResponse order = orderService.createOrder(orderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getOrdersOfMe() {
        Long userId = Long.parseLong(userClient.isValid());
        log.info("Getting orders for userId: {}", userId);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        userClient.isAdmin();
        log.info("Admin is fetching all orders");
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
