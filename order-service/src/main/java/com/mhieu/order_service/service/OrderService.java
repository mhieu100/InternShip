package com.mhieu.order_service.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mhieu.order_service.UserClient;
import com.mhieu.order_service.exception.AppException;
import com.mhieu.order_service.model.Order;
import com.mhieu.order_service.model.dto.OrderRequest;
import com.mhieu.order_service.model.dto.OrderResponse;
import com.mhieu.order_service.model.dto.ResponseWrapper;
import com.mhieu.order_service.model.dto.UserResponse;
import com.mhieu.order_service.repository.OrderRepository;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    @Autowired
    private UserClient userClient;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private OrderResponse toOrderResponse(Order order) {
        ResponseWrapper<UserResponse> userResponse = userClient.getUserById(order.getUserId());
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setUser(userResponse.getData());
        orderResponse.setId(order.getId());
        orderResponse.setProductName(order.getProductName());
        orderResponse.setQuantity(order.getQuantity());
        orderResponse.setPrice(order.getPrice());
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setCreatedAt(order.getCreatedAt());
        orderResponse.setUpdatedAt(order.getUpdatedAt());
        orderResponse.setStatus(order.getStatus());
        return orderResponse;
    }

    public OrderResponse createOrder(OrderRequest orderRequest, Long userId) {
        Order order = new Order();
        order.setProductName(orderRequest.getProductName());
        order.setPrice(orderRequest.getPrice());
        order.setQuantity(orderRequest.getQuantity());
        order.setUserId(userId);
        order.setTotalPrice(orderRequest.getPrice() * orderRequest.getQuantity());
        order.setStatus(Order.Status.PENDING);

        Order orderSaved = orderRepository.save(order);
        return toOrderResponse(orderSaved);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public String complete(Long id) throws AppException {
        Optional<Order> order = this.orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new AppException("Order not found");
        }
        order.get().setStatus(Order.Status.COMPLETED);
        this.orderRepository.save(order.get());
        return "Completed Order";
    }

    public String cancel(Long id) throws AppException {
        Optional<Order> order = this.orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new AppException("Order not found");
        }
        order.get().setStatus(Order.Status.CANCELLED);
        this.orderRepository.save(order.get());
        return "Cancel Order";
    }
}
