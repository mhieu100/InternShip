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
  callDisconnectCameras,
  callGetAllCameras,
  callUpdateCamera,
} from "../service/api";
import HLSPlayer from "./video";

const { Title } = Typography;
const { Option } = Select;

const CameraControlBack = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewingCamera, setViewingCamera] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

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
            onClick={() => {
              setViewModalVisible(true);
              setViewingCamera(record.id);
            }}
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
        <Modal
          title={`Xem Camera ${viewingCamera}`}
          open={viewModalVisible}
          onCancel={() => {
            callDisconnectCameras(viewingCamera);
            setViewModalVisible(false);
            setViewingCamera(null);
          }}
          footer={null}
        >
          {viewingCamera && (
            <HLSPlayer
              src={`http://localhost:8083/${viewingCamera}/index.m3u8`}
            />
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

export default CameraControlBack;
