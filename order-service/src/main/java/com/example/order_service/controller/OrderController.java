package com.example.order_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.order_service.UserClient;
import com.example.order_service.model.Order;
import com.example.order_service.service.OrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserClient userClient;

    // @PostMapping("/orders")
    // public ResponseEntity<?> createOrder(HttpServletRequest request, @RequestBody Order order) {
    //     String username = (String) request.getAttribute("username");
    //     if (username == null)
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     order.setUsername(username);
        
    //     return ResponseEntity.ok(orderService.createOrder(order, username));
    // }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
       
        String username = userClient.validate();
        order.setUsername(username);

        return ResponseEntity.ok(orderService.createOrder(order, username));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(HttpServletRequest request) {
        String username = (String) request.getAttribute("username");
        if (username == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        return ResponseEntity.ok(username);
    }
}
