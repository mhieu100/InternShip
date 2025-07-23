import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Descriptions,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  callCreateCamera,
  callDeleteCameras,
  callGetAllCameras,
  callUpdateCamera,
} from "../service/api";
import HLSPlayer from "./video";

const { Title } = Typography;
const { Option } = Select;

const CameraControl = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [streamModalVisible, setStreamModalVisible] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Fetch cameras
  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await callGetAllCameras();
      setCameras(response.data.result);
    } catch (error) {
      message.error("Không thể tải danh sách camera" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

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

  // Handle delete camera
  const handleDelete = async (id) => {
    try {
      await callDeleteCameras(id);
      message.success("Xóa camera thành công");
      fetchCameras();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa camera" + error);
    }
  };

  // Handle opening stream
  const handleOpenStream = async (camera) => {
    setSelectedCamera(camera);
    setStreamModalVisible(true);
    setStreamLoading(true);

    // Delay để backend có thời gian xử lý
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setStreamLoading(false);
    } catch (error) {
      message.error("Có lỗi khi khởi tạo stream");
      setStreamLoading(false);
    }
  };

  // Handle stream stop when closing modal
  const handleCloseStream = async () => {
    try {
      setStreamLoading(true);
      await fetch(`http://localhost:8083/destroy/${selectedCamera.id}`);
      setStreamModalVisible(false);
      setSelectedCamera(null);
      setStreamLoading(false);
    } catch (error) {
      message.error("Có lỗi khi dừng stream: " + error);
      setStreamLoading(false);
    }
  };

  // Status tag renderer
  const getStatusTag = (status) => {
    const colors = {
      ACTIVE: "green",
      OFFLINE: "gray",
      ERROR: "red",
    };
    return <Tag color={colors[status]}>{status}</Tag>;
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Độ phân giải",
      dataIndex: "resolution",
      key: "resolution",
    },
    {
      title: "FPS",
      dataIndex: "fps",
      key: "fps",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<VideoCameraOutlined />}
            onClick={() => handleOpenStream(record)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa camera"
            description="Bạn có chắc chắn muốn xóa camera này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Title level={4}>Quản lý Camera</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm Camera
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={cameras}
          rowKey="id"
          loading={loading}
        />

        {/* Stream Modal */}
        <Modal
          title="Xem Camera"
          open={streamModalVisible}
          onCancel={handleCloseStream}
          width={800}
          footer={[
            <Button
              key="close"
              onClick={handleCloseStream}
              disabled={streamLoading}
            >
              Đóng
            </Button>,
          ]}
        >
          {selectedCamera && (
            <Spin spinning={streamLoading} tip="Đang khởi tạo stream...">
              <div style={{ minHeight: "400px" }}>
                {!streamLoading && (
                  <>
                    <HLSPlayer
                      src={`http://localhost:8083/${selectedCamera.id}/index.m3u8`}
                    />
                    <Descriptions
                      title="Thông tin camera"
                      bordered
                      style={{ marginTop: "20px" }}
                    >
                      <Descriptions.Item label="Tên camera" span={3}>
                        {selectedCamera.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ IP" span={3}>
                        {selectedCamera.ipAddress}
                      </Descriptions.Item>
                      <Descriptions.Item label="Vị trí" span={3}>
                        {selectedCamera.location}
                      </Descriptions.Item>
                      <Descriptions.Item label="Độ phân giải">
                        {selectedCamera.resolution}
                      </Descriptions.Item>
                      <Descriptions.Item label="FPS">
                        {selectedCamera.fps}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        {getStatusTag(selectedCamera.status)}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                )}
              </div>
            </Spin>
          )}
        </Modal>

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
              rules={[
                { required: true, message: "Vui lòng nhập độ phân giải" },
              ]}
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
      </Card>
    </div>
  );
};

export default CameraControl;
