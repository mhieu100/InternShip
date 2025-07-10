package com.example.order_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.order_service.UserClient;
import com.example.order_service.model.Order;
import com.example.order_service.model.dto.OrderResponse;
import com.example.order_service.model.dto.ResponseWrapper;
import com.example.order_service.model.dto.UserResponse;
import com.example.order_service.repository.OrderRepository;


@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // @Value("${auth.service.url}")
    // private String authServiceUrl;

    // @Autowired
    // private RestTemplate restTemplate;

    @Autowired
    private UserClient userClient;

    public OrderResponse createOrder(Order order, String username) {

        Order orderSave = orderRepository.save(order);

        // // Gọi API protected từ auth-service
        // HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
        //         .getRequest();
        // String url = authServiceUrl + "/api/users/" + username;
        // String authHeader = request.getHeader("Authorization");
        // HttpHeaders headers = new HttpHeaders();
        // headers.set("Authorization", authHeader);
        // HttpEntity<Void> entity = new HttpEntity<>(headers);
        // ResponseEntity<ResponseWrapper<UserResponse>> response = restTemplate.exchange(
        //         url,
        //         HttpMethod.GET,
        //         entity,
        //         new ParameterizedTypeReference<ResponseWrapper<UserResponse>>() {});

        ResponseWrapper<UserResponse> userResponse = userClient.getUserByUsername(username);

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setUser(userResponse.getData());
        orderResponse.setId(orderSave.getId());
        orderResponse.setProductName(orderSave.getProductName());
        orderResponse.setQuantity(orderSave.getQuantity());
        orderResponse.setPrice(orderSave.getPrice());
        return orderResponse;
    }

}
