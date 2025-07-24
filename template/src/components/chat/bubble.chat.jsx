import { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, Spin } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

const BubbleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const apiKey = "AIzaSyD0HdfsD7PMphlYhrCirUAdGLjRc25C2Vs";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: inputValue,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API request failed");
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format");
      }

      const aiResponse = {
        role: "assistant",
        content: data.candidates[0].content.parts[0].text,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error: " + error.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {/* Chat Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RobotOutlined />}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 50,
            height: 50,
            display: isOpen ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
          }}
          className="chat-toggle-button"
        />
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              width: 350,
              height: 500,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transformOrigin: "bottom right",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#1890ff",
                color: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RobotOutlined />
                <span>AI Assistant</span>
              </div>
              <Button
                type="text"
                size="small"
                onClick={() => setIsOpen(false)}
                style={{ color: "white" }}
              >
                ✕
              </Button>
            </motion.div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: message.role === "user" ? 20 : -20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                      display: "flex",
                      flexDirection:
                        message.role === "user" ? "row-reverse" : "row",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Avatar
                        icon={
                          message.role === "user" ? (
                            <UserOutlined />
                          ) : (
                            <RobotOutlined />
                          )
                        }
                        style={{
                          backgroundColor:
                            message.role === "user" ? "#1890ff" : "#52c41a",
                        }}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: 8,
                        backgroundColor:
                          message.role === "user" ? "#1890ff" : "#f0f0f0",
                        color: message.role === "user" ? "white" : "black",
                      }}
                    >
                      {message.content}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Spin />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: 16,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                gap: 8,
              }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Type a message..."
                disabled={isLoading}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={isLoading}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add CSS for hover effect on the toggle button
const style = document.createElement("style");
style.textContent = `
  .chat-toggle-button:hover {
    transform: scale(1.1) rotate(10deg) !important;
  }
`;
document.head.appendChild(style);

export default BubbleChat;
