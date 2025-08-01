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
  callStartStream,
  callStopStream,
  callGetStreamStatus,
} from "@/services/api";
import ModalCamera from "@/components/features/modals/modal.camera";
import ModalStream from "@/components/features/modals/modal.stream";

const { Title } = Typography;

const CameraControl = () => {
  const [cameras, setCameras] = useState([]);
  const [camera, setCamera] = useState(null);

  const [loading, setLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState(null);
  const [streamReady, setStreamReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [streamModalVisible, setStreamModalVisible] = useState(false);
  const [streamQuality, setStreamQuality] = useState("medium");
  const [streamLoading, setStreamLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const waitForStream = async (cameraId) => {
    let attempts = 0;
    const maxAttempts = 20; // Increase timeout to match backend

    while (attempts < maxAttempts) {
      try {
        const response = await callGetStreamStatus(cameraId);
        console.log("Stream status:", response.active);
        if (response.active) {
          return true;
        }
        // Check for stream initialization error
        if (!response.active && response.uptimeMs === 0) {
          throw new Error("Stream initialization failed");
        }
      } catch (error) {
        console.error("Error checking stream status:", error);
        if (error.response && error.response.status === 404) {
          // Stream was stopped due to error
          throw new Error("Stream failed to start");
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Match backend polling interval
      attempts++;
    }
    return false;
  };

  const startCameraStream = async (cameraId) => {
    try {
      setStreamLoading(true);
      setStreamReady(false);

      // First stop any existing stream
      if (camera) {
        await stopCameraStream();
      }

      // Start new stream
      const startResponse = await callStartStream(cameraId, streamQuality);
      console.log("Start stream response:", startResponse);
      setCamera(cameraId);

      // Wait for stream to be ready
      const isReady = await waitForStream(cameraId);
      if (!isReady) {
        throw new Error("Timeout waiting for stream to be ready");
      }
      setStreamReady(true);

      // Start polling stream status
      pollStreamStatus(cameraId);
    } catch (error) {
      console.error("Error starting stream:", error);
      const errorMessage =
        error.response?.data || error.message || "Lỗi không xác định";
      message.error("Không thể kết nối đến camera: " + errorMessage);
      setStreamModalVisible(false);
      setCamera(null);
    } finally {
      setStreamLoading(false);
    }
  };

  const pollStreamStatus = async (cameraId) => {
    try {
      const status = await callGetStreamStatus(cameraId);

      if (status) {
        setStreamStatus(status);
        if (!status.active) {
          setStreamReady(false);
          if (status.uptimeMs === 0) {
            // Stream failed to initialize
            message.error("Stream bị ngắt do lỗi khởi tạo");
            setStreamModalVisible(false);
            setCamera(null);
            return;
          }
        }
      }

      if (streamModalVisible && camera === cameraId) {
        setTimeout(() => pollStreamStatus(cameraId), 5000);
      }
    } catch (error) {
      console.error("Error polling stream status:", error);
      setStreamReady(false);
      if (error.response?.status === 404) {
        // Stream was stopped
        message.error("Stream đã bị dừng");
        setStreamModalVisible(false);
        setCamera(null);
      }
    }
  };

  const stopCameraStream = async () => {
    if (camera) {
      try {
        await callStopStream(camera);
        setStreamStatus(null);
        setStreamReady(false);
      } catch (error) {
        console.error("Error stopping stream:", error);
      }
      setCamera(null);
    }
  };

  // Fetch cameras
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

  useEffect(() => {
    fetchCameras();
    return () => {
      // Cleanup: stop any active stream when component unmounts
      stopCameraStream();
    };
  }, []);

  // Handle delete camera
  const handleDelete = async (id) => {
    try {
      await callDeleteCameras(id);
      message.success("Xóa camera thành công");
      fetchCameras();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa camera: " + error.message);
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
    },
    {
      title: "Online",
      dataIndex: "isOnline",
      key: "isOnline",
      render: (isOnline) =>
        isOnline ? (
          <Tag color="green">ONLINE</Tag>
        ) : (
          <Tag color="red">OFFLINE</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<VideoCameraOutlined />}
            onClick={async () => {
              setStreamModalVisible(true);
              await startCameraStream(record.id);
            }}
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

        {/* <ModalStream
          streamModalVisible={streamModalVisible}
          streamLoading={streamLoading}
          streamReady={streamReady}
          camera={camera}
          cameras={cameras}
          streamQuality={streamQuality}
          setStreamQuality={setStreamQuality}
          streamStatus={streamStatus}
          stopCameraStream={stopCameraStream}
          setStreamModalVisible={setStreamModalVisible}
          getStatusTag={getStatusTag}
          startCameraStream={startCameraStream}
          setStreamLoading={setStreamLoading}
        /> */}

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
