import { EditFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
} from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import ModalProfile from "@/components/features/modals/modal.profile";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState();

  return (
    <div style={{ maxWidth: 950, margin: "auto", marginTop: 64 }}>
      <Card title="Thông tin cá nhân" style={{ marginBottom: 32 }}
        extra={<Button icon={<EditFilled />} onClick={() => { setIsModalOpen(true) }} >
          Chỉnh sửa
        </Button>}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{user.address || "Chưa cập nhật"}</Descriptions.Item>
        </Descriptions>
      </Card>
      <ModalProfile isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}  />
    </div>
  );
};
export default Profile;
