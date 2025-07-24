package com.mhieu.notification_service.listener;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mhieu.notification_service.event.OrderPlacedEvent;
import com.mhieu.notification_service.service.EmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final EmailService emailService;

    @KafkaListener(topics = "order-topic", groupId = "notification-group", containerFactory = "orderPlacedEventListenerFactory")
    public void handleOrderEvent(OrderPlacedEvent event) {
        System.out.println("📨 Nhận được event từ Kafka: " + event);
        // Thực hiện gửi email ở đây
        emailService.sendEmailFromTemplateSync(event.getUser().getEmail(),
                "Đơn hàng của bạn đã được đặt thành công , Mã đơn #Order-" + event.getOrderId(), "order-invoice",
                event);
    }
}
