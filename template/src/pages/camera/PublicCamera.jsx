import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Statistic,
  Progress,
  Input,
  App,
  Space,
  message,
} from 'antd'
import {
  VideoCameraOutlined,
  ReloadOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { callGetAllCameras } from '../../services/api'
import CameraCard from './CameraCard'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import ModalCamera from "@/components/features/modals/modal.camera";
import ModalHistory from '../../components/features/modals/modal.history'
import { getCameraStatusText } from '../../utils/status.color'

const { Search } = Input

const { Option } = Select

const CameraStatus = ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR']
const CameraType = ['security', 'monitoring', 'traffic', 'indoor', 'outdoor']

const PublicCamera = () => {

  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    search: '',
    projectId: '',
    status: '',
    type: '',
  })
  const [cameras, setCameras] = useState([])
  const [healthStatuses, setHealthStatuses] = useState({})
  const [form] = useForm();
  const [createModal, setCreateCamera] = useState(false)
  const [historyModal, setHistoryModal] = useState(false)

  const wsRef = useRef(null);

  useEffect(() => {
    fetchCameras();
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 2;
    let reconnectTimer = null;
    let isMounted = true;

    const connectWebSocket = () => {
      if (!isMounted) return;

      wsRef.current = new WebSocket('ws://localhost:8083/health-check');

      wsRef.current.onopen = () => {
        reconnectAttempts = 0;
        console.log("Connected to WebSocket");
        wsRef.current.send("Connect success client");
      };

      wsRef.current.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          console.log("Received from backend:", data);
          if (Array.isArray(data)) {
            setCameras(prevCameras => {
              const updatedCamerasMap = new Map(data.map(camera => [camera.id, camera]));

              return prevCameras.map(camera => {
                return updatedCamerasMap.has(camera.id)
                  ? updatedCamerasMap.get(camera.id)
                  : camera;
              });
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = (e) => {
        if (!isMounted) {
          console.log("Websocket close !")
          return;
        }

        if (e.code === 1000) {
          console.log("Connection closed by server");
          return;
        }

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(5000 * (reconnectAttempts + 1), 30000);
          reconnectTimer = setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, delay);
          reconnectAttempts++;
          console.log(`Retrying in ${delay / 1000}s... (Attempt ${reconnectAttempts})`);
        } else {
          console.error("Max reconnection attempts reached");
        }
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false; // Đánh dấu component đã unmount

      // Hủy bỏ timer reconnect nếu có
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component unmounted');
        } else if (wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.onopen = null;
          wsRef.current.close(1001, 'Connection cancelled');
        }
      }
    };
  }, []);

  const handleViewDetails = (cameraId) => {
    navigate(`/camera/${cameraId}`)
  }

  const handleHealthCheck = async (cameraId) => {
    try {
      const response = await cameraService.checkCameraHealth(cameraId)
      setHealthStatuses(prev => ({
        ...prev,
        [cameraId]: response.data
      }))

      if (response.data.isOnline) {
        message.success(`Camera online - Ping: ${response.data.responseTime}ms`)
      } else {
        message.error(`Camera offline - ${response.data.errorMessage || 'Không có phản hồi'}`)
      }
    } catch (error) {
      console.error('Error checking camera health:', error)
      message.error('Không thể kiểm tra tình trạng camera')
    }
  }



  const fetchCameras = async () => {
    try {
      const response = await callGetAllCameras();
      setCameras(response.data.result);
    } catch (error) {
      message.error("Không thể tải danh sách camera: " + error.message);
    }
  };

  // Hàm lọc camera
  const getFilteredCameras = () => {
    return cameras.filter(camera => {
      // Lọc theo tên hoặc địa điểm
      const searchMatch = !filters.search ||
        camera.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        camera.location.toLowerCase().includes(filters.search.toLowerCase());

      // Lọc theo trạng thái
      const statusMatch = !filters.status || camera.status === filters.status;

      // Lọc theo loại
      const typeMatch = !filters.type || camera.type.toLowerCase() === filters.type.toLowerCase();

      return searchMatch && statusMatch && typeMatch;
    });
  };

  // Lấy danh sách camera đã được lọc
  const filteredCameras = getFilteredCameras();
  const onlineCameras = cameras.filter(c => c.status === 'ONLINE').length;
  const totalCameras = cameras.length;
  const uptimePercentage = totalCameras > 0 ? (onlineCameras / totalCameras) * 100 : 0;

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giám sát Camera</h1>
          <p className="text-gray-600 mt-1">Theo dõi trực tiếp tất cả camera trong hệ thống</p>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryModal(true)}
          >
            Lịch sử kiểm tra
          </Button>

          <ModalHistory
            form={form}
            modalVisible={historyModal}
            setModalVisible={setHistoryModal}
          />

          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            onClick={() => setCreateCamera(true)}
          >
            Thêm camera mới
          </Button>

          <ModalCamera
            form={form}
            editingId={null}
            modalVisible={createModal}
            setModalVisible={setCreateCamera}
            fetchCameras={fetchCameras}
          />


        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="card-shadow hover:shadow-lg transition-shadow">
            <Statistic
              title={<span className="text-base">Camera trực tuyến</span>}
              value={onlineCameras}
              suffix={<span className="text-gray-500">{`/ ${totalCameras}`}</span>}
              prefix={<VideoCameraOutlined className="text-green-500 mr-2" />}
              valueStyle={{
                color: onlineCameras === totalCameras ? '#3f8600' : '#cf1322',
                fontSize: '28px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-shadow hover:shadow-lg transition-shadow">
            <Statistic
              title={<span className="text-base">Tỷ lệ hoạt động</span>}
              value={uptimePercentage}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined className="text-blue-500 mr-2" />}
              valueStyle={{
                color: uptimePercentage > 90 ? '#3f8600' : '#cf1322',
                fontSize: '28px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-shadow hover:shadow-lg transition-shadow">
            <div className="text-center">
              <Progress
                type="circle"
                percent={Math.round(uptimePercentage)}
                size={80}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
                strokeWidth={8}
              />
              <p className="mt-3 text-base text-gray-600">Tình trạng tổng thể</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="card-shadow mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên hoặc địa điểm..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              allowClear
              size="large"
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              {Object.values(CameraStatus).map(status => (
                <Option key={status} value={status}>
                  {getCameraStatusText(status)}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo loại camera"
              value={filters.type}
              onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              {Object.values(CameraType).map(type => (
                <Option key={type} value={type}>
                  {type === 'security' && 'Camera an ninh'}
                  {type === 'monitoring' && 'Camera giám sát'}
                  {type === 'traffic' && 'Camera giao thông'}
                  {type === 'indoor' && 'Camera trong nhà'}
                  {type === 'outdoor' && 'Camera ngoài trời'}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => setFilters({
                search: '',
                projectId: '',
                status: '',
                type: '',
              })}
              size="nomal"
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {filteredCameras.map(camera => (
          <Col
            key={camera.id}
            xs={24}
            sm={12}
            lg={8}
            xl={6}
            xxl={6}
          >
            <CameraCard
              camera={camera}
              onHealthCheck={handleHealthCheck}
              onViewDetails={handleViewDetails}
              healthStatus={healthStatuses[camera.id]}
            />
          </Col>
        ))}
      </Row>

      {filteredCameras.length === 0 && (
        <Card className="card-shadow">
          <div className="text-center py-12">
            <CameraOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy camera nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi bộ lọc hoặc thêm camera mới vào hệ thống
            </p>

          </div>
        </Card>
      )}
    </div>
  )
}

export default PublicCamera



