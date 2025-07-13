package com.mhieu.order_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mhieu.order_service.UserClient;
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

    public OrderResponse createOrder(OrderRequest orderRequest) {

        Order order = new Order();
        order.setProductName(orderRequest.getProductName());
        order.setPrice(orderRequest.getPrice());
        order.setQuantity(orderRequest.getQuantity());
        order.setUserId(orderRequest.getUserId());
        order.setTotalPrice(order.getPrice() * order.getQuantity());
        order.setStatus(Order.Status.PENDING);

        Order orderSave = orderRepository.save(order);
        ResponseWrapper<UserResponse> userResponse = userClient.getUserById(order.getUserId());
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setUser(userResponse.getData());
        orderResponse.setId(orderSave.getId());
        orderResponse.setProductName(orderSave.getProductName());
        orderResponse.setQuantity(orderSave.getQuantity());
        orderResponse.setPrice(orderSave.getPrice());
        orderResponse.setTotalPrice(orderSave.getTotalPrice());
        orderResponse.setStatus(orderSave.getStatus());
        return orderResponse;
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            ResponseWrapper<UserResponse> userResponse = userClient.getUserById(userId);
            OrderResponse orderResponse = new OrderResponse();
            orderResponse.setUser(userResponse.getData());
            orderResponse.setId(order.getId());
            orderResponse.setProductName(order.getProductName());
            orderResponse.setQuantity(order.getQuantity());
            orderResponse.setPrice(order.getPrice());
            orderResponse.setTotalPrice(order.getTotalPrice());
            orderResponse.setStatus(order.getStatus());
            return orderResponse;
        }).toList();
        return orderResponses;
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            ResponseWrapper<UserResponse> userResponse = userClient.getUserById(order.getUserId());
            OrderResponse orderResponse = new OrderResponse();
            orderResponse.setUser(userResponse.getData());
            orderResponse.setId(order.getId());
            orderResponse.setProductName(order.getProductName());
            orderResponse.setQuantity(order.getQuantity());
            orderResponse.setPrice(order.getPrice());
            orderResponse.setTotalPrice(order.getTotalPrice());
            orderResponse.setStatus(order.getStatus());
            return orderResponse;
        }).toList();
        return orderResponses;
    }

}
