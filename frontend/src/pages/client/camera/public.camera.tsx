import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Statistic,
  Progress,
  Input,
  Space,
  message
} from 'antd'
import {
  VideoCameraOutlined,
  ReloadOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { getCameraStatusText } from 'utils/status.color'
import CameraCard from 'components/card/camera.card'
import DrawerCamera from 'components/drawer/drawer.camera'
import { ICamera } from 'types/backend'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { fetchCamera } from 'redux/slices/cameraSilce'

const { Search } = Input

const { Option } = Select

const CameraStatus = ['ONLINE', 'OFFLINE']
const CameraType = ['security', 'monitoring', 'traffic', 'indoor', 'outdoor']

const PublicCamera = () => {
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    search: '',
    projectId: '',
    status: '',
    type: ''
  })
  const [form] = useForm()
  const [createModal, setCreateCamera] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)

  // const isFetching = useAppSelector((state) => state.camera.isFetching)
  // const meta = useAppSelector((state) => state.camera.meta)
  const cameras = useAppSelector<ICamera[]>((state) => state.camera.result)
  const dispatch = useAppDispatch()

  const [cameraShow, setCameraShow] = useState<ICamera[]>([])

  useEffect(() => {
    dispatch(fetchCamera())
  }, [dispatch])

  useEffect(() => {
    setCameraShow(cameras)
  }, [cameras])

  useEffect(() => {
    let reconnectAttempts = 0
    const MAX_RECONNECT_ATTEMPTS = 2
    let reconnectTimer: string | number | NodeJS.Timeout | null | undefined =
      null
    let isMounted = true

    const connectWebSocket = () => {
      if (!isMounted) return

      wsRef.current = new WebSocket('ws://localhost:8085/health')

      wsRef.current.onopen = () => {
        reconnectAttempts = 0
        console.log('Connected to WebSocket')
      }

      wsRef.current.onmessage = (event) => {
        if (!isMounted) return
        try {
          const data = JSON.parse(event.data)
          console.log('Received from backend:', data)
          if (Array.isArray(data)) {
            setCameraShow((prevCameras) => {
              const updatedCamerasMap = new Map(
                data.map((camera) => [camera.id, camera])
              )

              return prevCameras.map((camera) => {
                if (updatedCamerasMap.has(camera.id)) {
                  const updatedCamera = updatedCamerasMap.get(camera.id)
                  if (updatedCamera.status === 'OFFLINE') {
                    return {
                      ...updatedCamera,
                      viewerCount: 0
                    }
                  }
                  return updatedCamera
                }
                return camera
              })
            })
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error)
        }
      }
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      wsRef.current.onclose = (e) => {
        if (!isMounted) {
          console.log('Websocket close !')
          return
        }

        if (e.code === 1000) {
          console.log('Connection closed by server')
          return
        }

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(5000 * (reconnectAttempts + 1), 30000)
          reconnectTimer = setTimeout(() => {
            if (isMounted) connectWebSocket()
          }, delay)
          reconnectAttempts++
          console.log(
            `Retrying in ${delay / 1000}s... (Attempt ${reconnectAttempts})`
          )
        } else {
          console.error('Max reconnection attempts reached')
        }
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false

      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }

      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component unmounted')
        } else if (wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.onopen = null
          wsRef.current.close(1001, 'Connection cancelled')
        }
      }
    }
  }, [])

  const handleViewDetails = (cameraId: number) => {
    navigate(`/camera/${cameraId}`)
  }

  const getFilteredCameras = () => {
    return cameraShow.filter((camera) => {
      const searchMatch =
        !filters.search ||
        camera.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        camera.location.toLowerCase().includes(filters.search.toLowerCase())

      // Lọc theo trạng thái
      const statusMatch = !filters.status || camera.status === filters.status

      const typeMatch =
        !filters.type ||
        camera.type.toLowerCase() === filters.type.toLowerCase()

      return searchMatch && statusMatch && typeMatch
    })
  }

  const filteredCameras = getFilteredCameras()
  const onlineCameras = cameraShow.filter((c) => c.status === 'ONLINE').length
  const totalCameras = cameraShow.length
  const totalViewers = cameraShow.reduce(
    (sum, camera) => sum + (camera.viewerCount || 0),
    0
  )
  const uptimePercentage =
    totalCameras > 0 ? (onlineCameras / totalCameras) * 100 : 0

  return (
    <div className="space-y-6 p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Camera Monitoring
          </h1>
          <p className="mt-1 text-gray-600">
            Live monitoring of all cameras in the system
          </p>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            onClick={() => message.success('all cameras oke')}
          >
            Check History
          </Button>

          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            onClick={() => setCreateCamera(true)}
          >
            Add New Camera
          </Button>

          <DrawerCamera
            form={form}
            editing={null}
            open={createModal}
            setOpen={setCreateCamera}
          />
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card className="transition-shadow hover:shadow-lg">
            <Statistic
              title={<span className="text-base">Online Cameras</span>}
              value={onlineCameras}
              suffix={
                <span className="text-gray-500">{`/ ${totalCameras}`}</span>
              }
              prefix={<VideoCameraOutlined className="mr-2 text-green-500" />}
              valueStyle={{
                color: onlineCameras === totalCameras ? '#3f8600' : '#cf1322',
                fontSize: '28px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="transition-shadow hover:shadow-lg">
            <Statistic
              title={<span className="text-base">Total Viewers</span>}
              value={totalViewers}
              prefix={<EyeOutlined className="mr-2 text-blue-500" />}
              valueStyle={{
                color: totalViewers > 0 ? '#1890ff' : '#8c8c8c',
                fontSize: '28px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="transition-shadow hover:shadow-lg">
            <Statistic
              title={<span className="text-base">Uptime Rate</span>}
              value={uptimePercentage}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined className="mr-2 text-blue-500" />}
              valueStyle={{
                color: uptimePercentage > 90 ? '#3f8600' : '#cf1322',
                fontSize: '28px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="transition-shadow hover:shadow-lg">
            <div className="text-center">
              <Progress
                type="circle"
                percent={Math.round(uptimePercentage)}
                size={80}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a'
                }}
                strokeWidth={8}
              />
              <p className="mt-3 text-base text-gray-600">Overall Status</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name or location..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              allowClear
              size="large"
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              {Object.values(CameraStatus).map((status) => (
                <Option key={status} value={status}>
                  {getCameraStatusText(status)}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by camera type"
              value={filters.type}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              {Object.values(CameraType).map((type) => (
                <Option key={type} value={type}>
                  {type === 'security' && 'Security'}
                  {type === 'monitoring' && 'Monitoring'}
                  {type === 'traffic' && 'Traffic'}
                  {type === 'indoor' && 'Indoor'}
                  {type === 'outdoor' && 'Outdoor'}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() =>
                setFilters({
                  search: '',
                  projectId: '',
                  status: '',
                  type: ''
                })
              }
              size="small"
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {filteredCameras.map((camera) => (
          <Col key={camera.id} xs={24} sm={12} lg={8} xl={6} xxl={6}>
            <CameraCard camera={camera} onViewDetails={handleViewDetails} />
          </Col>
        ))}
      </Row>

      {filteredCameras.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <CameraOutlined className="mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Không tìm thấy camera nào
            </h3>
            <p className="mb-4 text-gray-600">
              Thử thay đổi bộ lọc hoặc thêm camera mới vào hệ thống
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PublicCamera
