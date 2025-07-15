import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const ChatPage = () => {
  const [connected, setConnected] = useState(false);
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str), // log chi tiết STOMP
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setConnected(true);
        stompClient.subscribe("/topic/messages", (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker error: ", frame.headers["message"]);
        console.error("❌ Details: ", frame.body);
      },
      onWebSocketError: (error) => {
        console.error("❌ WebSocket error: ", error);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    // Tải tin nhắn cũ
    axios.get("http://localhost:8080/api/messages").then((res) => {
      const history = res.data.map((m) => ({
        sender: m.sender,
        content: m.content,
      }));
      setMessages(history);
    });

    return () => stompClient.deactivate(); // cleanup
  }, []);

  const sendMessage = () => {
    if (!sender || !message) return;
    const msg = { sender, content: message };
    clientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(msg),
    });
    setMessage("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {connected ? (
        <>
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <ul>
            {messages.map((m, index) => (
              <li key={index}>
                <b>{m.sender}:</b> {m.content}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Connecting to chat server...</p>
      )}
    </div>
  );
};

export default ChatPage;
