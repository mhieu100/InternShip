import { callCreateCamera, callUpdateCamera } from "../../service/api";
import {
  Space,
  Button,
  Form,
  Select,
  message,
  Modal,
  Input,
  InputNumber,
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
          values.ipAddress,
          values.location,
          values.resolution,
          values.fps,
          values.status
        );
        if (response && response.statusCode === 200) {
          message.success("Cập nhật camera thành công");
        }
      } else {
        const response = await callCreateCamera(
          values.name,
          values.ipAddress,
          values.location,
          values.resolution,
          values.fps,
          values.status
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
            name="ipAddress"
            label="Địa chỉ IP"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ IP" }]}
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
            name="resolution"
            label="Độ phân giải"
            rules={[{ required: true, message: "Vui lòng nhập độ phân giải" }]}
          >
            <Input placeholder="Ví dụ: 1920x1080" />
          </Form.Item>

          <Form.Item
            name="fps"
            label="FPS"
            rules={[{ required: true, message: "Vui lòng nhập FPS" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="ACTIVE">ACTIVE</Option>
              <Option value="OFFLINE">OFFLINE</Option>
              <Option value="ERROR">ERROR</Option>
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
