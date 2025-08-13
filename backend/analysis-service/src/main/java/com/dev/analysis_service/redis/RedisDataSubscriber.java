package com.dev.analysis_service.redis;


import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisDataSubscriber implements MessageListener {

    // private final ObjectMapper objectMapper;
    // private final FakeUserRepository fakeUserRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            // FakeUser user = objectMapper.readValue(json, FakeUser.class);
            // fakeUserRepository.save(user);
            System.out.println("💾 Đã lưu record vào MySQL: " + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
