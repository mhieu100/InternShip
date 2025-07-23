import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Form,
  Select,
  message,
  Popconfirm,
  Modal,
  Descriptions,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  callDeleteCameras,
  callGetAllCameras,
  callStartStream,
  callStopStream,
  callGetStreamStatus,
  callGetStreamUrl,
} from "../service/api";
import HLSPlayer from "./video";
import ModalCamera from "../components/modal/modal.camera";

const { Title } = Typography;

const CameraControl = () => {
  const [cameras, setCameras] = useState([]);
  const [camera, setCamera] = useState(null);

  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState(null);
  const [streamReady, setStreamReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [streamModalVisible, setStreamModalVisible] = useState(false);
  const [streamQuality, setStreamQuality] = useState("medium");
  const [streamLoading, setStreamLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const waitForStream = async (cameraId) => {
    let attempts = 0;
    const maxAttempts = 20; // Increase timeout to match backend

    while (attempts < maxAttempts) {
      try {
        const response = await callGetStreamStatus(cameraId);
        console.log("Stream status:", response.data);
        if (response.data && response.data.active) {
          return true;
        }
        // Check for stream initialization error
        if (
          response.data &&
          !response.data.active &&
          response.data.uptimeMs === 0
        ) {
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
      const response = await callGetStreamStatus(cameraId);
      const status = response.data;

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
            onClick={async () => {
              setStreamModalVisible(true);
              await startCameraStream(record.id);
            }}

          >
            Xem
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedCamera(record);
              setInfoModalVisible(true);
            }}
          >
            Thông tin
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

  const renderStreamQualitySelector = () => (
    <Select
      value={streamQuality}
      onChange={async (value) => {
        setStreamQuality(value);
        if (camera) {
          setStreamLoading(true);
          try {
            await stopCameraStream();
            await startCameraStream(camera);
          } finally {
            setStreamLoading(false);
          }
        }
      }}
      style={{ width: 120 }}
      disabled={streamLoading}
    >
      <Select.Option value="low">Thấp (500kbps)</Select.Option>
      <Select.Option value="medium">Trung bình (1Mbps)</Select.Option>
      <Select.Option value="high">Cao (2Mbps)</Select.Option>
    </Select>
  );

  const renderStreamStats = () => {
    if (!streamStatus) return null;
    return (
      <div style={{ marginTop: 10, fontSize: "12px", color: "#666" }}>
        <p>Thời gian hoạt động: {Math.round(streamStatus.uptimeMs / 1000)}s</p>
        <p>Chất lượng: {streamStatus.quality}</p>
        <p>Trạng thái: {streamStatus.active ? "Đang phát" : "Dừng"}</p>
      </div>
    );
  };

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
          title="Camera Stream"
          open={streamModalVisible}
          onCancel={async () => {
            await stopCameraStream();
            setStreamModalVisible(false);
          }}
          width={800}
          footer={[
            renderStreamQualitySelector(),
            <Button
              key="disconnect"
              onClick={stopCameraStream}
              danger
              disabled={streamLoading}
            >
              Ngắt kết nối
            </Button>,
            <Button
              key="close"
              onClick={() => {
                stopCameraStream();
                setStreamModalVisible(false);
              }}
              disabled={streamLoading}
            >
              Đóng
            </Button>,
          ]}
          destroyOnHidden={true}
          maskClosable={false}
        >
          {streamModalVisible && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 32,
              }}
            >
              {streamLoading || !streamReady ? (
                <div
                  style={{
                    width: "400px",
                    height: "225px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000000",
                  }}
                >
                  <Spin>
                    <div style={{ padding: "20px", color: "white" }}>
                      {streamLoading
                        ? "Đang kết nối đến camera..."
                        : "Đang khởi tạo stream..."}
                    </div>
                  </Spin>
                </div>
              ) : (
                camera && (
                  <HLSPlayer
                    src={callGetStreamUrl(camera)}
                    key={`${camera}-${streamQuality}`}
                    quality={streamQuality}
                    onError={() => {
                      message.error(
                        "Không thể kết nối đến camera. Vui lòng thử lại sau."
                      );
                      stopCameraStream();
                      setStreamModalVisible(false);
                    }}
                  />
                )
              )}
              {/* Camera info section */}
              {cameras &&
                cameras.length > 0 &&
                (() => {
                  const cam = cameras.find((c) => c.id === camera);
                  if (!cam) return null;
                  return (
                    <div style={{ minWidth: 220 }}>
                      <h3>Thông tin Camera</h3>
                      <p>
                        <b>Tên:</b> {cam.name}
                      </p>
                      <p>
                        <b>Địa chỉ IP:</b> {cam.ipAddress}
                      </p>
                      <p>
                        <b>Vị trí:</b> {cam.location}
                      </p>
                      <p>
                        <b>Độ phân giải:</b> {cam.resolution}
                      </p>
                      <p>
                        <b>FPS:</b> {cam.fps}
                      </p>
                      <p>
                        <b>Trạng thái:</b> {getStatusTag(cam.status)}
                      </p>
                      <p>
                        <b>Chất lượng stream:</b> {streamQuality}
                      </p>
                      {renderStreamStats()}
                    </div>
                  );
                })()}
            </div>
          )}
        </Modal>
        <Modal
          title="Thông tin Camera"
          open={infoModalVisible}
          onCancel={() => setInfoModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setInfoModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          {selectedCamera && (
            <div>
              <p>
                <b>Tên:</b> {selectedCamera.name}
              </p>
              <p>
                <b>Địa chỉ IP:</b> {selectedCamera.ipAddress}
              </p>
              <p>
                <b>Vị trí:</b> {selectedCamera.location}
              </p>
              <p>
                <b>Độ phân giải:</b> {selectedCamera.resolution}
              </p>
              <p>
                <b>FPS:</b> {selectedCamera.fps}
              </p>
              <p>
                <b>Trạng thái:</b> {getStatusTag(selectedCamera.status)}
              </p>
            </div>
          )}
        </Modal>
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
