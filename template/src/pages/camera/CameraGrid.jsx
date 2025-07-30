import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Statistic,
  Progress,
  Input,
} from 'antd'
import {
  VideoCameraOutlined,
  ReloadOutlined,

  CameraOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { callGetAllCameras } from '../../services/api'

const { Search } = Input


const CameraStatus = ['online', 'offline', 'maintenance', 'error']
const CameraType = ['security', 'monitoring', 'traffic', 'indoor', 'outdoor']

const CameraGrid = () => {

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    projectId: '',
    status: '',
    type: '',
  })
  const [cameras, setCameras] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const camerasResponse = await callGetAllCameras();
      console.log(camerasResponse)
      setCameras(camerasResponse.data.results)
    } catch (error) {
      console.error('Error loading initial data:', error)
      message.error('Không thể tải dữ liệu camera')
    } finally {
      setLoading(false)
    }
  }

  const loadCameras = async () => {
    // try {
    //   const params = {
    //     search: filters.search || undefined,
    //     projectId: filters.projectId,
    //     status: filters.status,
    //     type: filters.type,
    //     limit: 100
    //   }

    //   const response = await cameraService.getCameras(params)
    //   setCameras(response.data)
    // } catch (error) {
    //   console.error('Error loading cameras:', error)
    //   message.error('Không thể tải danh sách camera')
    // }
  }

  const handleHealthCheck = async (cameraId) => {
    // try {
    //   const response = await cameraService.checkCameraHealth(cameraId)
    //   setHealthStatuses(prev => ({
    //     ...prev,
    //     [cameraId]: response.data
    //   }))

    //   if (response.data.isOnline) {
    //     message.success(`Camera online - Ping: ${response.data.responseTime}ms`)
    //   } else {
    //     message.error(`Camera offline - ${response.data.errorMessage || 'Không có phản hồi'}`)
    //   }
    // } catch (error) {
    //   console.error('Error checking camera health:', error)
    //   message.error('Không thể kiểm tra tình trạng camera')
    // }
  }

  const handleHealthCheckAll = async () => {
    // try {
    //   setLoading(true)
    //   const response = await cameraService.checkAllCamerasHealth(filters.projectId)
    //   const healthMap = response.data.reduce((acc, health) => {
    //     acc[health.id] = health
    //     return acc
    //   }, {} )

    //   setHealthStatuses(healthMap)
    //   message.success('Kiểm tra tình trạng tất cả camera thành công')
    // } catch (error) {
    //   console.error('Error checking all cameras health:', error)
    //   message.error('Không thể kiểm tra tình trạng camera')
    // } finally {
    //   setLoading(false)
    // }
  }

  const getCameraStatusColor = (status) => {
    const colors = {
      [CameraStatus.ONLINE]: 'success',
      [CameraStatus.OFFLINE]: 'error',
      [CameraStatus.MAINTENANCE]: 'warning',
      [CameraStatus.ERROR]: 'error'
    }
    return colors[status]
  }

  const getCameraStatusText = (status) => {
    const texts = {
      [CameraStatus.ONLINE]: 'Trực tuyến',
      [CameraStatus.OFFLINE]: 'Ngoại tuyến',
      [CameraStatus.MAINTENANCE]: 'Bảo trì',
      [CameraStatus.ERROR]: 'Lỗi'
    }
    return texts[status]
  }

  const onlineCameras = cameras.filter(c => c.status === 'ONLINE').length
  const totalCameras = cameras.length
  const uptimePercentage = totalCameras > 0 ? (onlineCameras / totalCameras) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giám sát Camera</h1>
          <p className="text-gray-600 mt-1">Theo dõi trực tiếp tất cả camera trong hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleHealthCheckAll}
          loading={loading}
        >
          Kiểm tra tất cả
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="card-shadow">
            <Statistic
              title="Camera trực tuyến"
              value={onlineCameras}
              suffix={`/ ${totalCameras}`}
              prefix={<VideoCameraOutlined className="text-green-500" />}
              valueStyle={{ color: onlineCameras === totalCameras ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-shadow">
            <Statistic
              title="Tỷ lệ hoạt động"
              value={uptimePercentage}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined className="text-blue-500" />}
              valueStyle={{ color: uptimePercentage > 90 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-shadow">
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
              />
              <p className="mt-2 text-sm text-gray-600">Tình trạng tổng thể</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="card-shadow">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm camera..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onSearch={loadCameras}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.values(CameraStatus).map(status => (
                <Option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Loại camera"
              value={filters.type}
              onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.values(CameraType).map(type => (
                <Option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Camera Grid */}
      <Row gutter={[16, 16]}>
        {cameras.map(camera => (
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
              onStreamToggle={handleStreamToggle}
              onViewDetails={handleViewDetails}
              healthStatus={healthStatuses[camera.id]}
            />
          </Col>
        ))}
      </Row>

      {cameras.length === 0 && !loading && (
        <Card className="card-shadow">
          <div className="text-center py-12">
            <CameraOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy camera nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi bộ lọc hoặc thêm camera mới vào hệ thống
            </p>
            <Button type="primary" icon={<VideoCameraOutlined />}>
              Thêm camera mới
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default CameraGrid

