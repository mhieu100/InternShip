import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Form,
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
  callDeleteCameras,
  callGetAllCameras,
} from "@/services/api";
import ModalCamera from "@/components/features/modals/modal.camera";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CameraControl = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await callGetAllCameras();
      setCameras(response.data.result);
    } catch (error) {
      message.error("Không thể tải danh sách camera: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await callDeleteCameras(id);
      message.success("Xóa camera thành công");
      fetchCameras();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa camera: " + error.message);
    }
  };

  const getStatusTag = (status) => {
    const colors = {
      ACTIVE: "green",
      OFFLINE: "gray",
      ERROR: "red",
    };
    return <Tag color={colors[status]}>{status}</Tag>;
  };

  console.log(cameras)

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Stream URL",
      dataIndex: "streamUrl",
      key: "streamUrl",
      render: (text) => text || "N/A",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
   
    {
      title: "Độ phân giải",
      dataIndex: "resolution",
      key: "resolution",
       render: (resolution) => resolution ? resolution : "cập nhật..."
    },
    {
      title: "Khung hình",
      dataIndex: "fps",
      key: "fps",
      render: (fps) => fps ? `${fps} FPS` : "cập nhật..."
    },
    {
      title: "Quyền",
      dataIndex: "public",
      key: "public",
      render: (isPublic) =>  {return (<Tag color={isPublic ? "red" : "green"}>{isPublic ? "PUBLIC" : "PRIVATE"}</Tag>)}, 
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
            onClick={() => navigate(`/camera/${record.id}`)}
            disabled={!record.streamUrl}
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

  useEffect(() => {
    fetchCameras();
  }, []);

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
          scroll={{ x: 1300 }}
        />

        <ModalCamera
          form={form}
          editingId={editingId}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          fetchCameras={fetchCameras}
        />
      </Card>
    </div>
  );
};

export default CameraControl;
