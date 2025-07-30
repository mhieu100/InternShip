package com.mhieu.order_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhieu.order_service.annotation.Message;
import com.mhieu.order_service.exception.AppException;
import com.mhieu.order_service.model.dto.OrderRequest;
import com.mhieu.order_service.model.dto.OrderResponse;
import com.mhieu.order_service.service.OrderService;
import com.mhieu.order_service.service.httpClient.UserClient;

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
    @Message("create new order")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Long userId = Long.parseLong(userClient.isValid());
        log.info("Creating order for userId: {}", userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(orderRequest, userId));
    }

    @GetMapping("/me")
    @Message("get orders of user")
    public ResponseEntity<List<OrderResponse>> getOrdersOfMe() {
        Long userId = Long.parseLong(userClient.isValid());
        log.info("Getting orders for userId: {}", userId);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping
    @Message("get all orders (admin)")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        userClient.isAdmin();
        log.info("Admin is fetching all orders");
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}/complete")
    @Message("complete a order")
    public ResponseEntity<String> complete(@PathVariable("id") Long id) throws AppException {
        userClient.isAdmin();
        log.info("Complete orders : {}", id);
        return ResponseEntity.ok(orderService.complete(id));
    }

    @GetMapping("/{id}/cancel")
    @Message("cancel a order")
    public ResponseEntity<String> cancel(@PathVariable("id") Long id) throws AppException {
        userClient.isValid();
        log.info("Cancel orders : {}", id);
        return ResponseEntity.ok(orderService.cancel(id));
    }
}
