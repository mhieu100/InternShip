import { useCallback, useEffect, useRef, useState } from "react";
import {
  callAllUserForChat,
  callGetMessages,
  callMyConversations,
  callSendMessage,
} from "@/services/api";
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
  Form,
} from "antd";
import { SendOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import ModalConversation from "@/components/features/modals/modal.conversation";
import { useSelector } from "react-redux";

const { Sider, Content, Footer } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const userLogin = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});

  // New state for conversation creation
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const [form] = Form.useForm();

  const socketRef = useRef(null);

  const loadUsers = async () => {
    try {
      const response = await callAllUserForChat();

      const users = response.data.filter((user) => user.userId != userLogin.id);

      setAvailableUsers(users);
    } catch {
      message.error("Failed to load users");
    }
  };

  const showCreateConversation = () => {
    setIsModalVisible(true);
    loadUsers();
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await callMyConversations();
      setConversations(response?.data || []);
    } catch {
      setError("Failed to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handelFetchMessage = async (conversationId) => {
    if (!messagesMap[conversationId]) {
      const response = await callGetMessages(conversationId);

      const sortedMessages = [...response.data].sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
      );

      setMessagesMap((prev) => ({
        ...prev,
        [conversationId]: sortedMessages,
      }));
    }

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  const handelSendMessage = async () => {
    if (!selectedConversation.id || !message.trim()) return;
    await callSendMessage(selectedConversation.id, message);
    setMessage("");
    // const response = await callSendMessage(selectedConversation.id, message);
    // if (response.data) {
    //   setMessagesMap((prev) => ({
    //     ...prev,
    //     [selectedConversation.id]: [
    //       ...(prev[selectedConversation.id] || []),
    //       response.data,
    //     ],
    //   }));
    // }
    // setMessage("");
  };

  const handleIncomingMessage = useCallback(
    (message) => {
      setMessagesMap((prev) => {
        const existingMessages = prev[message.conversationId] || [];
        const messageExists = existingMessages.some((msg) => {
          if (msg.id && message.id) {
            return msg.id === message.id;
          }
          return false;
        });

        if (!messageExists) {
          const updatedMessages = [...existingMessages, message].sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
          );

          return {
            ...prev,
            [message.conversationId]: updatedMessages,
          };
        }

        return prev;
      });

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.message,
                lastTimestamp: new Date(message.createdDate).toLocaleString(),
                unread:
                  selectedConversation?.id === message.conversationId
                    ? 0
                    : (conv.unread || 0) + 1,
                modifiedDate: message.createdDate,
              }
            : conv
        );

        return updatedConversations;
      });
    },
    [selectedConversation]
  );

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      handelFetchMessage(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    if (!socketRef.current) {
      const connectionUrl =
        "http://localhost:8099?token=" + localStorage.getItem("access_token");

      socketRef.current = new io(connectionUrl);

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("message", (message) => {
        const messageObject = JSON.parse(message);
        if (messageObject?.conversationId) {
          handleIncomingMessage(messageObject);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [handleIncomingMessage]);

  useEffect(() => {
    if (selectedConversation?.id && socketRef.current) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversation.id ? { ...conv, unread: 0 } : conv
        )
      );
    }
  }, [selectedConversation]);

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

  const currentMessages = selectedConversation
    ? messagesMap[selectedConversation.id] || []
    : [];

  return (
    <Layout style={{ height: "90vh" }}>
      <Sider width={300} theme="light">
        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: "18px" }}>
            Các cuộc hội thoại
          </Text>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={showCreateConversation}
          >
            Tạo mới
          </Button>
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
                dataSource={currentMessages}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      backgroundColor: item.me ? "#eeeee4" : "#b4b4b0ff",
                      margin: 20,
                      padding: 20,
                      textAlign: item.me ? "end" : "start",
                      borderRadius: 10,
                    }}
                  >
                    <List.Item.Meta
                      style={{
                        display: "flex",
                        flexDirection: item.me ? "row-reverse" : "row",
                        alignItems: "center",
                      }}
                      avatar={
                        <Avatar
                          style={{ marginLeft: 10 }}
                          icon={<UserOutlined />}
                        />
                      }
                      title={
                        item.sender.name.toUpperCase() +
                        " " +
                        dayjs(item.createdDate).format("YYYY-MM-DD hh:mm")
                      }
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

      <ModalConversation
        form={form}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        availableUsers={availableUsers}
        fetchConversations={fetchConversations}
        setSelectedConversation={setSelectedConversation}
      />
    </Layout>
  );
};

export default ChatPage;
