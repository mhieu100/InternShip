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
  Switch,
} from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

const ModalCamera = ({
  form,
  editingId,
  modalVisible,
  setModalVisible,
  fetchCameras,
}) => {

   const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        const response = await callUpdateCamera(
          editingId,
          values.name,
          values.location,
          values.streamUrl,
          values.type,
          values.public
        );
        if (response && response.statusCode === 200) {
          message.success("Cập nhật camera thành công");
        }
      } else {
        const response = await callCreateCamera(
          values.name,
          values.location,
          values.streamUrl,
          values.type,
          values.public
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
              extra="URL luồng video trực tiếp từ camera (Chỉ hỗ trợ RTSP)"
              rules={[
                {
                  required: true,
                  message: "Stream URL không được để trống"
                },
                {
                  pattern: /^rtsp:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/,
                  message: "Stream URL phải là định dạng RTSP hợp lệ (ví dụ: rtsp://ip:port/stream)"
                },
                {
                  max: 255,
                  message: "Stream URL không được vượt quá 255 ký tự"
                }
              ]}
            >
              <Input
                placeholder="Ví dụ: rtsp://camera-ip:port/stream"
                className="font-mono"
              />
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
                  name="public"
                  label="Trạng thái công khai"
                  
                  initialValue={true}
                >
                  <Switch disabled={user.role === "USER"} />
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