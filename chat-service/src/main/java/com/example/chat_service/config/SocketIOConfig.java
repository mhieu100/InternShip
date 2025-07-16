package com.example.chat_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

@Configuration
public class SocketIOConfig {
    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();
        configuration.setPort(8099);
        configuration.setOrigin("*");
        configuration.setMaxFramePayloadLength(1024 * 1024); // 1MB
        configuration.setMaxHttpContentLength(1024 * 1024); // 1MB
        configuration.setPingInterval(25000); // 25s
        configuration.setPingTimeout(60000); // 60s

        return new SocketIOServer(configuration);
    }
}
