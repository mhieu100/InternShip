package com.dev.order_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.dev.order_service.model.Order;
import com.dev.order_service.repository.OrderRepository;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order createOrder(Order order) {
        Order saved = orderRepository.save(order);
        return saved;
    }
}
