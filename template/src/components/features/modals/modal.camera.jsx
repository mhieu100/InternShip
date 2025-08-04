import { callCreateCamera, callUpdateCamera } from "@/services/api";
import {
  Space,
  Button,
  Form,
  Select,
  message,
  Modal,
  Input,
  Row,
  Col,
  App,
} from "antd";

const { Option } = Select;

const ModalCamera = ({
  form,
  editingId,
  modalVisible,
  setModalVisible,
  fetchCameras,
}) => {
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
    <App>
      <Modal
        title={editingId ? "Sửa Camera" : "Thêm Camera Mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={720}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          className="px-4"
        >
          {/* Thông tin cơ bản */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên camera"
                  rules={[{ required: true, message: "Vui lòng nhập tên camera" }]}
                >
                  <Input placeholder="Nhập tên camera..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Vị trí"
                  rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
                >
                  <Input placeholder="Nhập vị trí lắp đặt..." />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="streamUrl"
              label="Stream URL"
              extra="URL luồng video trực tiếp từ camera (RTSP, HLS,...)"
            >
              <Input placeholder="Ví dụ: rtsp://camera-ip:port/stream" />
            </Form.Item>
          </div>

          {/* Cấu hình camera */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Cấu hình camera</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Loại camera"
                  rules={[{ required: true, message: "Vui lòng chọn loại camera" }]}
                >
                  <Select placeholder="Chọn loại camera">
                    <Option value="SECURITY">Camera an ninh</Option>
                    <Option value="MONITORING">Camera giám sát</Option>
                    <Option value="TRAFFIC">Camera giao thông</Option>
                    <Option value="INDOOR">Camera trong nhà</Option>
                    <Option value="OUTDOOR">Camera ngoài trời</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="ONLINE">Trực tuyến</Option>
                    <Option value="OFFLINE">Ngoại tuyến</Option>
                    <Option value="MAINTENANCE">Bảo trì</Option>
                    <Option value="ERROR">Lỗi</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Cài đặt chất lượng */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Cài đặt chất lượng</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="quality"
                  label="Chất lượng"
                  rules={[{ required: true, message: "Vui lòng chọn chất lượng" }]}
                >
                  <Select placeholder="Chọn chất lượng">
                    <Option value="UHD">Ultra HD (4K)</Option>
                    <Option value="FHD">Full HD (1080p)</Option>
                    <Option value="HD">HD (720p)</Option>
                    <Option value="SD">SD (480p)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="resolution"
                  label="Độ phân giải"
                  rules={[{ required: true, message: "Vui lòng chọn độ phân giải" }]}
                >
                  <Select placeholder="Chọn độ phân giải">
                    <Option value="4K">3840 x 2160 (4K)</Option>
                    <Option value="1080p">1920 x 1080 (1080p)</Option>
                    <Option value="720p">1280 x 720 (720p)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="fps"
                  label="Tốc độ khung hình"
                  rules={[{ required: true, message: "Vui lòng chọn FPS" }]}
                >
                  <Select placeholder="Chọn FPS">
                    <Option value="120">120 FPS</Option>
                    <Option value="90">90 FPS</Option>
                    <Option value="60">60 FPS</Option>
                    <Option value="30">30 FPS</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Buttons */}
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </App>
  );
};

export default ModalCamera;