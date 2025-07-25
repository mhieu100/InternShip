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
} from "antd";
import {
  EyeOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import styled from "styled-components";
import { callGetAllCameras } from "../service/api";

const CameraGrid = styled(Row)`
  padding: 24px;
  gap: 24px;
`;

const CameraCard = styled(Card)`
  width: 100%;
  .ant-card-body {
    padding: 12px;
  }
  .camera-preview {
    position: relative;
    width: 100%;
    height: 200px;
    background: #000;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .camera-canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .camera-overlay {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    color: white;
    font-size: 12px;
  }
  .camera-controls {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`;

const PublicCamera = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStreams, setActiveStreams] = useState(new Set());
  const [players, setPlayers] = useState({});

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await callGetAllCameras();
      setCameras(response.data.result || []);
    } catch (error) {
      console.error("Failed to fetch cameras:", error);
    } finally {
      setLoading(false);
    }
  };

  const startStream = (cameraId) => {
    if (activeStreams.has(cameraId)) return;

    const canvas = document.getElementById(`camera-${cameraId}`);
    if (!canvas) return;

    try {
      const wsUrl = `ws://localhost:8084/stream?cameraId=${cameraId}`;
      const player = new JSMpeg.Player(wsUrl, {
        canvas,
        autoplay: true,
        audio: true,
        pauseWhenHidden: false,
        videoBufferSize: 1024 * 1024,
        onSourceEstablished: () => {
          console.log(`Stream established for camera ${cameraId}`);
          setActiveStreams((prev) => new Set([...prev, cameraId]));
        },
        onError: (error) => {
          console.error(`Stream error for camera ${cameraId}:`, error);
          stopStream(cameraId);
        },
      });

      setPlayers((prev) => ({ ...prev, [cameraId]: player }));
    } catch (error) {
      console.error(`Failed to start stream for camera ${cameraId}:`, error);
    }
  };

  const stopStream = (cameraId) => {
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
    <CameraGrid gutter={[24, 24]}>
      {cameras.map((camera) => (
        <Col key={camera.id} xs={24} sm={12} md={8} lg={6}>
          <CameraCard
            title={
              <Space>
                <StatusBadge status={getStatusColor(camera.status)} />
                {camera.name}
              </Space>
            }
            extra={
              <Tooltip title="Camera Settings">
                <Button type="text" icon={<SettingOutlined />} />
              </Tooltip>
            }
          >
            <div className="camera-preview">
              <canvas id={`camera-${camera.id}`} className="camera-canvas" />
              <div className="camera-overlay">
                <VideoCameraOutlined /> {camera.resolution}
              </div>
              <div className="camera-controls">
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
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div>Location: {camera.location}</div>
              <div>FPS: {camera.fps}</div>
            </Space>
          </CameraCard>
        </Col>
      ))}
    </CameraGrid>
  );
};

export default PublicCamera;
