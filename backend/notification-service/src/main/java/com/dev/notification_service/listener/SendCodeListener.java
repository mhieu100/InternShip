package com.dev.notification_service.listener;

import com.dev.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.dev.notification_service.event.SendCodeEvent;

@Component
@RequiredArgsConstructor
public class SendCodeListener {

    private final EmailService emailService;

    @KafkaListener(topics = "send-code-topic", groupId = "notification-group", containerFactory = "sendCodeEventListenerFactory")
    public void handleSendCodeEvent(SendCodeEvent event) {
        System.out.println("📨 Nhận được event từ Kafka: " + event);
        emailService.sendEmailFromTemplateSync(event.getEmail(), "Verify App Now ( Test App )", "verify-code" , String.valueOf(event.getCode()));
    }
}
