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
          values.type,
          values.quality,
          values.resolution,
          values.fps
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
          values.type,
          values.quality,
          values.resolution,
          values.fps
        );
        console.log(response)
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

          <Form.Item
            name="quality"
            label="Chất lượng"
            rules={[{ required: true, message: "Vui lòng chọn chất lượng camera" }]}
          >
            <Select>
              <Option value="HD">HD</Option>
              <Option value="SD">SD</Option>
              <Option value="FHD">FHD</Option>
              <Option value="UHD">UHD</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fps"
            label="Khung số hình ảnh (FPS)"
            rules={[{ required: true, message: "Vui lòng chọn khung hình camera" }]}
          >
            <Select>
              <Option value="30">30 FPS</Option>
              <Option value="60">60 FPS</Option>
              <Option value="90">90 FPS</Option>
              <Option value="120">120 FPS</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="resolution"
            label="Độ phân giải"
            rules={[{ required: true, message: "Vui lòng chọn độ phân giải  camera" }]}
          >
            <Select>
              <Option value="720p">720p</Option>
              <Option value="1080p">1080p</Option>
              <Option value="4K">4K</Option>
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