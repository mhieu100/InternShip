import { useEffect, useState } from "react";
import {
  callGetMessages,
  callMyConversations,
  callSendMessage,
} from "../service/api";
import {
  Layout,
  Menu,
  Input,
  Button,
  List,
  Typography,
  Avatar,
  Tag,
  Space,
} from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const { Sider, Content, Footer } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [allMess, setAllMess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await callMyConversations();
      setConversations(response?.data || []);
    } catch (err) {
      setError("Failed to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handelFetchMessage = async () => {
    const response = await callGetMessages(selectedConversation.id);
    setAllMess(response?.data || []);
  };

  const handelSendMessage = async () => {
    if (!selectedConversation.id || !message.trim()) return;
    const response = await callSendMessage(selectedConversation.id, message);
    setMessage("");
    handelFetchMessage();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      handelFetchMessage();
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // useEffect(() => {
  //   console.log("Initializing socket connection...");

  //   // const connectionUrl = "http://localhost:8099?token=" + localStorage.getItem("access_token");
  //   const connectionUrl = "http://localhost:8099";
  //   const socket = new io(connectionUrl);
    
    
  //   socket.on("connect", () => {
  //     console.log("Socket connected");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   socket.on("message", (message) => {
  //     console.log("New message received:", message);
  //   });

  //   // Cleanup function - disconnect socket when component unmounts
  //   return () => {
  //     console.log("Disconnecting socket...");
  //     socket.disconnect();
  //   };
  // }, []);

  if (loading) return <p>Kiểm tra các cuộc hội thoại...</p>;
  if (error) return <p>{error}</p>;

  const menuChat = conversations.map((conversation) => ({
    key: conversation.id,
    icon: <Avatar icon={<UserOutlined />} />,
    label: (
      <Space>
        {conversation.conversationName.toUpperCase()}
        <Tag color={conversation.type === "DIRECT" ? "blue" : "green"}>
          {conversation.type === "DIRECT" ? "Cá nhân" : "Nhóm"}
        </Tag>
      </Space>
    ),
    onClick: () => setSelectedConversation(conversation),
  }));

  return (
    <Layout style={{ height: "90vh" }}>
      <Sider width={300} theme="light">
        <div style={{ padding: "16px" }}>
          <Text strong style={{ fontSize: "18px" }}>
            Các cuộc hội thoại
          </Text>
        </div>
        <Menu
          mode="inline"
          items={menuChat}
          selectedKeys={selectedConversation ? [selectedConversation.id] : []}
          style={{ borderRight: "none" }}
        />
      </Sider>
      <Layout>
        {selectedConversation ? (
          <>
            <Content style={{ padding: "16px", background: "#fff" }}>
              <div
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  Cuộc hội thoại với{" "}
                  {selectedConversation.conversationName.toUpperCase()}
                </Text>
              </div>
              <List
                dataSource={allMess}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      backgroundColor: item.me ? "#eeeee4" : "#b4b4b0ff",
                      padding: 20,
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} /> }
                      title={item.sender.name.toUpperCase() + " " + dayjs(item.createdDate).format('YYYY-MM-DD hh:mm')}
                      description={item.message}
                    />
                  </List.Item>
                )}
                style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
              />
            </Content>

            <Footer
              style={{
                padding: "16px",
                background: "#fff",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Space.Compact style={{ width: "100%", display: "flex" }}>
                <Input
                  style={{
                    width: "calc(100% - 100px)",
                    borderRight: "none",
                    borderRadius: "4px 0 0 4px",
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button
                  type="primary"
                  onClick={handelSendMessage}
                  icon={<SendOutlined />}
                  style={{ borderRadius: "0 4px 4px 0" }}
                >
                  Send
                </Button>
              </Space.Compact>
            </Footer>
          </>
        ) : (
          <Content
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <Text type="secondary">
              Select a conversation to start chatting.
            </Text>
          </Content>
        )}
      </Layout>
    </Layout>
  );
};

export default ChatPage;
