package com.dev.order_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.dev.order_service.dto.UserDto;
import com.dev.order_service.dto.response.OrderResponse;
import com.dev.order_service.model.Order;
import com.dev.order_service.repository.OrderRepository;
import com.dev.order_service.service.OrderService;
import com.dev.order_service.service.httpClient.UserClient;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserClient userClient;
    private final OrderService orderService;

    @GetMapping("oke")
    public String user() {
        return "User";
    }

    @GetMapping("oke2")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {
        return "Admin";
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        order.setUserId(userId);
        return orderService.createOrder(order);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable("id") Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        UserDto user = userClient.getUserById(order.getUserId());
        return new OrderResponse(order.getId(), order.getProduct(), order.getPrice(), user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
