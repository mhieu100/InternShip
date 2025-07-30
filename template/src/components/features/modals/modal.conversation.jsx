import { UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";

const { Option } = Select;
import { useState } from "react";
import { callCreateGroupChat, callCreateSingleChat } from "@/services/api";

const ModalConversation = ({
  form,
  isModalVisible,
  setIsModalVisible,
  availableUsers,
  fetchConversations,
  setSelectedConversation,
}) => {
  const [conversationType, setConversationType] = useState("DIRECT");
  const [groupName, setGroupName] = useState("");

  const handleCreateConversation = async (values) => {
    console.log("Creating conversation with values:", values);
    try {
      if (values.type === "DIRECT") {
        const response = await callCreateSingleChat(values.users);
        console.log(response)
        if (response && response.statusCode === 201) {
          message.success("DIRECT create success");
          setSelectedConversation(response.data);
        }
      } else {
        const response = await callCreateGroupChat(
          values.groupName,
          values.users
        );
        if (response && response.statusCode === 201) {
          message.success("DIRECT create success");
          setSelectedConversation(response.data);
        }
      }

      fetchConversations();
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Failed to create conversation");
    }
  };

  return (
    <>
      <Modal
        title="Tạo cuộc trò chuyện mới"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateConversation}
          initialValues={{ type: "DIRECT" }}
        >
          <Form.Item name="type" label="Loại cuộc trò chuyện">
            <Radio.Group
              onChange={(e) => setConversationType(e.target.value)}
              value={conversationType}
            >
              <Radio value="DIRECT">Cá nhân</Radio>
              <Radio value="GROUP">Nhóm</Radio>
            </Radio.Group>
          </Form.Item>

          {conversationType === "GROUP" && (
            <Form.Item
              name="groupName"
              label="Tên nhóm"
              rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}
            >
              <Input
                placeholder="Nhập tên nhóm"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Form.Item>
          )}

          <Form.Item
            name="users"
            label="Chọn thành viên"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một thành viên",
              },
            ]}
          >
            <Select
              mode={conversationType === "GROUP" ? "multiple" : "single"}
              style={{ width: "100%" }}
              placeholder="Chọn thành viên"
              showSearch
              optionFilterProp="children"
            >
              {availableUsers.map((user) => (
                <Option key={user.userId} value={user.userId}>
                  <Space>
                    {/* <Avatar src={user.avatar} size="small" /> */}
                    {user.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={
                  conversationType === "GROUP" ? (
                    <UsergroupAddOutlined />
                  ) : (
                    <UserOutlined />
                  )
                }
              >
                Tạo {conversationType === "GROUP" ? "nhóm" : "cuộc trò chuyện"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalConversation;
