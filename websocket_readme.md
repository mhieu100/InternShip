
# WebSocket Integration Guide

## ✅ 1. Backend mở WebSocket endpoint

**Spring Boot với `spring-websocket` (Raw WebSocket)**

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MySocketHandler(), "/ws/camera-health")
                .setAllowedOrigins("*"); // Cẩn thận CORS
    }
}

@Component
public class MySocketHandler extends TextWebSocketHandler {
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // Xử lý khi frontend gửi message đến backend
        System.out.println("FE gửi: " + message.getPayload());

        // Gửi phản hồi
        session.sendMessage(new TextMessage("PONG: " + message.getPayload()));
    }
}
```

🔁 Nếu dùng STOMP (ví dụ với SockJS), thì setup sẽ khác (theo kiểu topic/subscription). Nếu bạn cần cấu hình đó, mình có thể gửi luôn.

---

## ✅ 2. Frontend JavaScript kết nối WebSocket

**Vanilla JavaScript kết nối WebSocket (không STOMP):**

```javascript
const socket = new WebSocket("ws://localhost:8080/ws/camera-health");

socket.onopen = () => {
    console.log("✅ Connected to WebSocket");
    socket.send("Hello from FE");
};

socket.onmessage = (event) => {
    console.log("📩 Message from backend:", event.data);
};

socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
};

socket.onclose = () => {
    console.log("🔌 WebSocket closed");
};
```

> ✅ Đảm bảo port WebSocket mở (thường là cùng port 8080 nếu dùng chung app backend).

---

## ✅ 3. Gửi data realtime từ backend đến FE

**Spring Boot với STOMP:**

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

public void notifyClient() {
    messagingTemplate.convertAndSend("/topic/camera-status", "camera A is offline");
}
```

**Frontend STOMP Subscribe:**

```javascript
client.subscribe("/topic/camera-status", (message) => {
    console.log("Camera status:", message.body);
});
```

> ⛔ Cần cấu hình STOMP (`@EnableWebSocketMessageBroker`, SockJS). Nếu bạn dùng raw WebSocket thì **không cần cấu hình kiểu này**.

---

## ✅ Bạn đang dùng loại nào?

- Nếu dùng `WebSocketHandler` → raw WebSocket (đơn giản hơn).
- Nếu dùng `@MessageMapping`, `SimpMessagingTemplate` → STOMP-based WebSocket.
