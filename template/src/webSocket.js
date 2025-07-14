import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connect = (token, onMessageReceived) => {
  const socket = new SockJS('http://localhost:8080/chat');
  stompClient = Stomp.over(socket);

  stompClient.connect(
    { Authorization: `Bearer ${token}`, maxMessageId: '0' }, // Gửi token và maxMessageId
    () => {
      console.log('Connected to WebSocket');
      // Đăng ký nhận tin nhắn riêng tư
      stompClient.subscribe('/user/queue/private', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
      // Đăng ký nhận tin nhắn nhóm (cần roomId)
      stompClient.subscribe('/user/queue/room/room1', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    },
    (error) => {
      console.error('WebSocket connection error:', error);
    }
  );
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect();
    console.log('Disconnected from WebSocket');
  }
};

export const sendPrivateMessage = (message) => {
  stompClient.send('/app/private.send', {}, JSON.stringify(message));
};

export const sendGroupMessage = (message) => {
  stompClient.send('/app/room.send', {}, JSON.stringify(message));
};