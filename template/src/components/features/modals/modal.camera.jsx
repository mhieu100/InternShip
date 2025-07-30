import { callCreateCamera, callUpdateCamera } from "@/services/api";
import {
  Space,
  Button,
  Form,
  Select,
  message,
  Modal,
  Input,
} from "antd";

const { Option } = Select;

const ModalCamera = ({
  form,
  editingId,
  modalVisible,
  setModalVisible,
  fetchCameras,
}) => {
  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        const response = await callUpdateCamera(
          editingId,
          values.name,
          values.location,
          values.streamUrl,
          values.status,
          values.type
        );
        if (response && response.statusCode === 200) {
          message.success("Cập nhật camera thành công");
        }
      } else {
        const response = await callCreateCamera(
          values.name,
          values.location,
          values.streamUrl,
          values.status,
          values.type
        );
        if (response && response.statusCode === 201) {
          message.success("Thêm camera thành công");
        } else {
          message.error(response.message);
        }
      }
      setModalVisible(false);
      form.resetFields();
      fetchCameras();
    } catch (error) {
      message.error("Có lỗi xảy ra" + error);
    }
  };
  return (
    <>
      <Modal
        title={editingId ? "Sửa Camera" : "Thêm Camera Mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên camera"
            rules={[{ required: true, message: "Vui lòng nhập tên camera" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Vị trí"
            rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="streamUrl"
            label="Stream URL"
          >
            <Input placeholder="Ví dụ: rtsp://..." />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="ONLINE">ONLINE</Option>
              <Option value="OFFLINE">OFFLINE</Option>
              <Option value="MAINTENANCE">MAINTENANCE</Option>
              <Option value="ERROR">ERROR</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại camera"
            rules={[{ required: true, message: "Vui lòng chọn loại camera" }]}
          >
            <Select>
              <Option value="SECURITY">SECURITY</Option>
              <Option value="MONITORING">MONITORING</Option>
              <Option value="TRAFFIC">TRAFFIC</Option>
              <Option value="INDOOR">INDOOR</Option>
              <Option value="OUTDOOR">OUTDOOR</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCamera;