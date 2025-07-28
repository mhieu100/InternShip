import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Badge,
  Tooltip,
  Empty,
  Spin,
  List,
  Divider,
  Layout,
} from "antd";
import {
  EyeOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  StopOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { callGetAllCameras, callStatusCamera } from "../service/api";

const { Content, Sider } = Layout;

const PublicCamera = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStreams, setActiveStreams] = useState(new Set());
  const [players, setPlayers] = useState({});
  const [statusLogs, setStatusLogs] = useState([]);

  setInterval(async () => {
    if (activeStreams.size > 0) {
      callStatusCamera(activeStreams.values().next().value)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error("Error fetching camera status:", err);
        });
    }
  }, 10000);

  useEffect(() => {
    fetchCameras();
  }, []);

  const addStatusLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatusLogs((prev) => [{ message, timestamp }, ...prev].slice(0, 100));
  };

  const fetchCameras = async () => {
    try {
      addStatusLog("Fetching camera list...");
      const response = await callGetAllCameras();
      setCameras(response.data.result || []);
      addStatusLog(`Loaded ${response.data.result?.length || 0} cameras`);
    } catch (error) {
      console.error("Failed to fetch cameras:", error);
      addStatusLog("Failed to fetch cameras");
    } finally {
      setLoading(false);
    }
  };

  const startStream = (cameraId) => {
    if (activeStreams.has(cameraId)) return;

    const canvas = document.getElementById(`camera-${cameraId}`);
    if (!canvas) return;

    addStatusLog(`Starting stream for camera ${cameraId}`);

    try {
      const wsUrl = `ws://localhost:8084/stream?cameraId=${cameraId}`;
      const player = new JSMpeg.Player(wsUrl, {
        canvas,
        autoplay: true,
        audio: true,
        pauseWhenHidden: false,
        videoBufferSize: 1024 * 1024,
        onSourceEstablished: () => {
          addStatusLog(`Stream established for camera ${cameraId}`);
          setActiveStreams((prev) => new Set([...prev, cameraId]));
        },
        onError: (error) => {
          addStatusLog(`Stream error for camera ${cameraId}`);
          console.error(`Stream error for camera ${cameraId}:`, error);
          stopStream(cameraId);
        },
      });

      setPlayers((prev) => ({ ...prev, [cameraId]: player }));
    } catch (error) {
      addStatusLog(`Failed to start stream for camera ${cameraId}`);
      console.error(`Failed to start stream for camera ${cameraId}:`, error);
    }
  };

  const stopStream = (cameraId) => {
    addStatusLog(`Stopping stream for camera ${cameraId}`);
    const player = players[cameraId];
    if (player) {
      player.destroy();
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[cameraId];
        return newPlayers;
      });
    }
    setActiveStreams((prev) => {
      const newStreams = new Set(prev);
      newStreams.delete(cameraId);
      return newStreams;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "offline":
        return "red";
      case "error":
        return "orange";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading cameras..." />
      </div>
    );
  }

  if (!cameras.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No cameras found"
        />
      </div>
    );
  }

  return (
    <Layout
      style={{
        height: "calc(100vh - 64px)",
        background: "#fff",
      }}
    >
      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <Row gutter={[24, 24]}>
          {cameras.map((camera) => (
            <Col key={camera.id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <Card
                style={{
                  width: "100%",
                  marginBottom: "24px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s",
                }}
                bodyStyle={{
                  padding: "12px",
                }}
                hoverable
                title={
                  <Space>
                    <Badge status={getStatusColor(camera.status)} />
                    {camera.name}
                  </Space>
                }
                extra={
                  <Tooltip title="Camera Settings">
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      size="small"
                    />
                  </Tooltip>
                }
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingBottom: "56.25%",
                    background: "#000",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <canvas
                    id={`camera-${camera.id}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      padding: "4px 8px",
                      background: "rgba(0, 0, 0, 0.7)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      zIndex: 1,
                    }}
                  >
                    <VideoCameraOutlined /> {camera.resolution}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      display: "flex",
                      gap: "8px",
                      zIndex: 1,
                    }}
                  >
                    {!activeStreams.has(camera.id) ? (
                      <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => startStream(camera.id)}
                      >
                        Watch
                      </Button>
                    ) : (
                      <Button
                        danger
                        size="small"
                        icon={<StopOutlined />}
                        onClick={() => stopStream(camera.id)}
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  <span>{camera.location}</span>
                  <span>{camera.fps} FPS</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <Sider
        width={350}
        style={{
          background: "#fff",
          borderLeft: "1px solid #f0f0f0",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <Divider orientation="left">Status Logs</Divider>
        <List
          size="small"
          dataSource={statusLogs}
          renderItem={(item) => (
            <List.Item style={{ padding: "8px 0", borderBottom: "none" }}>
              <span
                style={{ color: "#888", fontSize: "12px", marginRight: "8px" }}
              >
                <ClockCircleOutlined /> {item.timestamp}
              </span>
              <span>{item.message}</span>
            </List.Item>
          )}
        />
      </Sider>
    </Layout>
  );
};

export default PublicCamera;
