package com.mhieu.notification_service.listener;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mhieu.notification_service.event.OrderPlacedEvent;

@Component
public class OrderEventListener {

    @KafkaListener(topics = "order-topic", groupId = "notification-group", containerFactory = "orderPlacedEventListenerFactory")
    public void handleOrderEvent(OrderPlacedEvent event) {
        System.out.println("📨 Nhận được event từ Kafka: " + event);
        // Thực hiện gửi email ở đây

    }
}
