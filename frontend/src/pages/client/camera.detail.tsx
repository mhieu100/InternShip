import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  Button,
  Space,
  Badge,
  Descriptions,
  message,
  Row,
  Col,
  Statistic,
  Tag,
  Alert,
  List
} from 'antd'
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  CameraOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  EyeOutlined
} from '@ant-design/icons'

import JSMpeg from '@cycjimmy/jsmpeg-player'
import VirtualList from 'rc-virtual-list'
import { callGetCamera } from 'services/camera.api'
// import ModalCheckHealth from '../../components/features/modals/modal.check'
const CONTAINER_HEIGHT = 400

const CameraDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const videoRef = useRef(null)
  const isMountedRef = useRef(true)
  const playerRef = useRef(null)

  const [camera, setCamera] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modalCheck, setModalCheck] = useState(false)
  const [cameraData, setCameraData] = useState(null)
  const [checkLoading, setCheckLoading] = useState(false)
  const [takePhotoLoading, setTakePhotoLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  const [statusLogs, setStatusLogs] = useState([])
  const wsRef = useRef(null)

  useEffect(() => {
    if (camera?.status === 'OFFLINE' && isStreaming) {
      stopStream()
    }
  }, [camera?.status, isStreaming])

  useEffect(() => {
    isMountedRef.current = true

    if (id) {
      loadCameraData()
      connectWebSocket()
    }

    return () => {
      isMountedRef.current = false
      stopStream()
      disconnectWebSocket()
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
          addStatusLog(`Đã đóng kết nối stream cho camera ${id}`)
        } catch (error) {
          console.error('Lỗi khi đóng stream:', error)
        } finally {
          playerRef.current = null
        }
      }
      setIsStreaming(false)
      setCameraData(null)
      setIsFullscreen(false)
      setModalCheck(false)
    }
  }, [id])

  const addStatusLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      id: Date.now(),
      message: sanitizeMessage(message), // Xử lý an toàn trước khi hiển thị
      rawMessage: message, // Giữ nguyên bản gốc nếu cần
      type, // 'info', 'success', 'error', 'warning'
      timestamp
    }

    setStatusLogs((prev) => [logEntry, ...prev].slice(0, 100))
  }

  const connectWebSocket = () => {
    if (wsRef.current) {
      disconnectWebSocket()
    }

    try {
      wsRef.current = new WebSocket('ws://localhost:8085/health')

      wsRef.current.onopen = () => {
        console.log('Connected to WebSocket for viewer count updates')
        addStatusLog('Đã kết nối WebSocket để nhận cập nhật thời gian thực')
        wsRef.current.send('Connect success client')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (Array.isArray(data)) {
            console.log(data)
            const updatedCamera = data.find((cam) => cam.id === parseInt(id))
            if (updatedCamera) {
              const previousViewerCount = viewerCount
              const newViewerCount = updatedCamera.viewerCount || 0
              setViewerCount(newViewerCount)

              if (updatedCamera.status === 'OFFLINE') {
                setViewerCount(0)
                if (isStreaming) {
                  stopStream()
                  addStatusLog(`Camera đã offline - dừng stream tự động`)
                }
              }

              // Update camera data with all information from WebSocket
              setCamera((prev) => {
                const newCamera = {
                  ...prev,
                  status: updatedCamera.status,
                  viewerCount:
                    updatedCamera.status === 'OFFLINE' ? 0 : newViewerCount,
                  fps: updatedCamera.fps,
                  resolution: updatedCamera.resolution,
                  name: updatedCamera.name,
                  location: updatedCamera.location,
                  streamUrl: updatedCamera.streamUrl,
                  type: updatedCamera.type,
                  isPublic: updatedCamera.isPublic
                }

                // Log status changes
                if (prev && prev.status !== updatedCamera.status) {
                  addStatusLog(
                    `Trạng thái camera thay đổi: ${updatedCamera.status}`
                  )
                }

                return newCamera
              })

              // Log viewer count changes only if camera is not offline
              if (
                updatedCamera.status !== 'OFFLINE' &&
                newViewerCount !== previousViewerCount
              ) {
                addStatusLog(`Cập nhật số người xem: ${newViewerCount}`)
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        addStatusLog('Lỗi kết nối WebSocket', 'error')
      }

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed')
        addStatusLog('Đã ngắt kết nối WebSocket')
      }
    } catch (error) {
      console.error('Error connecting WebSocket:', error)
      addStatusLog('Không thể kết nối WebSocket', 'error')
    }
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  // console.log(camera)
  const sanitizeMessage = (message) => {
    const allowedTags = {
      a: ['href', 'target', 'rel'],
      strong: [],
      em: []
    }

    return message
  }

  const renderMessage = (message) => {
    return <span dangerouslySetInnerHTML={{ __html: message }} />
  }

  useEffect(() => {
    if (isStreaming) {
      checkCameraHealth()
      addStatusLog('Bắt đầu giám sát trạng thái camera qua WebSocket')
    } else {
      addStatusLog('Dừng giám sát trạng thái camera')
    }
  }, [isStreaming])

  const loadCameraData = async () => {
    if (!id) return
    try {
      const response = await callGetCamera(id)
      setCamera(response.data)
      addStatusLog(`Đã tải thông tin camera: ${response.data.name}`)
    } catch (error) {
      console.error('Error loading camera data:', error)
      message.error('Không thể tải thông tin camera')
      navigate('/')
    }
  }

  const checkCameraHealth = async () => {
    if (!id) return

    try {
      const response = await callCheckHealthCamera(id)
      setCameraData(response.data)
      addStatusLog(
        `Kiểm tra kết nối: ${
          response.data.live ? 'Trực tuyến' : 'Ngoại tuyến'
        } - ${response.data.ping + 'ms'}`
      )
    } catch (error) {
      console.error('Error checking camera health:', error)
    }
  }

  const onHealthCheck = async () => {
    if (!id) return

    setCheckLoading(true)
    try {
      const response = await callCheckHealthCamera(id)
      setCameraData(response.data)
      setModalCheck(true)
      addStatusLog(
        `Kiểm tra kết nối: ${
          response.data.live ? 'Trực tuyến' : 'Ngoại tuyến'
        } - ${response.data.ping + 'ms'}`
      )
    } catch (error) {
      console.error('Error checking camera health:', error)
    } finally {
      setCheckLoading(false)
    }
  }

  const startStream = async (cameraId) => {
    if (!isMountedRef.current) return false

    const canvas = document.getElementById(`camera-${cameraId}`)
    if (!canvas) return

    addStatusLog(`Bắt đầu stream cho camera ${cameraId}`)

    try {
      const wsUrl = `ws://localhost:8085/stream?cameraId=${cameraId}`
      const newPlayer = new JSMpeg.Player(wsUrl, {
        canvas,
        autoplay: true,
        audio: true,
        pauseWhenHidden: false,
        videoBufferSize: 1024 * 1024,
        onSourceEstablished: () => {
          if (isMountedRef.current) {
            addStatusLog(`Stream đã được thiết lập cho camera ${cameraId}`)
            setIsStreaming(true)
          }
        },
        onError: (error) => {
          if (isMountedRef.current) {
            addStatusLog(`Lỗi stream cho camera ${cameraId}`)
            console.error(`Lỗi stream cho camera ${cameraId}:`, error)
            stopStream()
          }
        }
      })

      playerRef.current = newPlayer
      return true
    } catch (error) {
      if (isMountedRef.current) {
        addStatusLog(`Không thể bắt đầu stream cho camera ${cameraId}`)
        console.error(`Không thể bắt đầu stream cho camera ${cameraId}:`, error)
      }
      return false
    }
  }

  const stopStream = () => {
    if (!playerRef.current) return false

    try {
      if (
        playerRef.current.ws &&
        playerRef.current.ws.readyState === WebSocket.OPEN
      ) {
        playerRef.current.ws.close(1000)
      }

      playerRef.current.destroy()
      addStatusLog(`Đã dừng stream cho camera ${id}`)
      return true
    } catch (error) {
      console.error('Lỗi khi dừng stream:', error)
      return false
    } finally {
      playerRef.current = null
      if (isMountedRef.current) {
        setIsStreaming(false)
        setViewerCount(0)
      }
    }
  }

  const handleStreamToggle = async () => {
    if (!id) return

    // Check if camera is offline
    if (camera?.status === 'OFFLINE') {
      message.error('Không thể bắt đầu stream - Camera đang offline')
      return
    }

    try {
      if (isStreaming) {
        stopStream()
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Camera data will be updated via WebSocket
        setIsStreaming(false)
      } else {
        startStream(id)
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Camera data will be updated via WebSocket
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error toggling stream:', error)
      message.error('Không thể thay đổi trạng thái stream')
    }
  }

  const handleTakeScreenshot = async () => {
    try {
      setTakePhotoLoading(true)
      const response = await callScreenShot(camera.id)
      console.log(response)
      if (response && response.statusCode === 200) {
        const imageUrl = response.data.pictureUrl
        message.success({
          content: (
            <span>
              Chụp ảnh thành công! Xem tại:
              <a
                href={'http://localhost:8083/storage/snapshots/' + imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '5px' }}
              >
                link hình ảnh
              </a>
            </span>
          ),
          duration: 5
        })

        addStatusLog(
          "Ảnh đã chụp: <a href='http://localhost:8083/storage/snapshots/" +
            imageUrl +
            "' target='_blank' rel='noopener noreferrer'>Xem ảnh</a>",
          'success'
        )
        setTakePhotoLoading(false)
      } else {
        message.error(response.message || 'Không thể chụp ảnh')
        addStatusLog(
          'Chụp ảnh thất bại: ' + (response.message || 'Không rõ lý do')
        )
        setTakePhotoLoading(false)
      }
    } catch (error) {
      console.error('Error taking screenshot:', error)
      setTakePhotoLoading(false)
      addStatusLog('Chụp ảnh thất bại: ' + error.message)
      message.error('Chụp ảnh thất bại')
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const getCameraStatusColor = (status) => {
    const colors = {
      ['ONLINE']: 'success',
      ['OFFLINE']: 'error',
      ['MAINTENANCE']: 'warning',
      ['ERROR']: 'error'
    }
    return colors[status]
  }

  const getCameraStatusText = (status) => {
    const texts = {
      ['ONLINE']: 'Trực tuyến',
      ['OFFLINE']: 'Ngoại tuyến',
      ['MAINTENANCE']: 'Bảo trì',
      ['ERROR']: 'Lỗi'
    }
    return texts[status]
  }

  if (!camera) {
    return (
      <div className="flex-center min-h-[400px]">
        <div className="text-center">
          <h3>Không tìm thấy camera</h3>
          <Button onClick={() => navigate(-1)}>Quay lại danh sách</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6 p-10">
      {camera.status === 'OFFLINE' && (
        <Alert
          message="Camera ngoại tuyến"
          description="Camera hiện tại không thể kết nối. Vui lòng kiểm tra kết nối mạng và thiết bị."
          type="error"
          showIcon
        />
      )}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={`Stream trực tiếp  ${camera.name}`}
            extra={
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            }
            className="card-shadow"
          >
            {camera && (
              <div className=" p-4 bg-gray-50 rounded-lg">
                <Row gutter={[16, 8]}>
                  <Col span={6}>
                    <Statistic title="FPS" value={camera.fps} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Độ phân giải" value={camera.resolution} />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Người xem"
                      value={viewerCount}
                      prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
                      valueStyle={{
                        color: viewerCount > 0 ? '#1890ff' : '#8c8c8c'
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Badge
                      status={camera.status === 'ONLINE' ? 'success' : 'error'}
                      text={camera.status === 'ONLINE' ? 'Online' : 'Offline'}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <div
              className="relative bg-gray-900 rounded-lg overflow-hidden"
              style={{ aspectRatio: '16/9' }}
            >
              <canvas
                id={`camera-${camera.id}`}
                className="w-full h-full object-cover"
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              {camera.status === 'ONLINE' ? (
                !isStreaming && (
                  <div className="relative w-full h-full">
                    <img
                      src="https://hi-static.fpt.vn/sys/hifpt/fsh/smarthome/img/post_item/camera-chong-trom-7.jpg"
                      alt="Camera placeholder"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <VideoCameraOutlined className="text-4xl mb-2" />
                      <p>Ấn phát để xem trực tiếp</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex-center text-white">
                  <div className="text-center">
                    <VideoCameraOutlined className="text-6xl mb-4" />
                    <p className="text-lg">
                      {camera.status === 'OFFLINE'
                        ? 'Camera ngoại tuyến'
                        : 'Stream chưa được bắt đầu'}
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex-between">
                <Space>
                  <Button
                    type="primary"
                    icon={
                      isStreaming ? (
                        <PauseCircleOutlined />
                      ) : (
                        <PlayCircleOutlined />
                      )
                    }
                    onClick={handleStreamToggle}
                    disabled={camera.status === 'OFFLINE'}
                  >
                    {isStreaming ? 'Dừng' : 'Phát'}
                  </Button>
                  <Button
                    icon={<CameraOutlined />}
                    onClick={handleTakeScreenshot}
                    disabled={!isStreaming}
                    loading={takePhotoLoading}
                  >
                    Chụp ảnh
                  </Button>
                </Space>

                <Button
                  icon={<FullscreenOutlined />}
                  onClick={handleFullscreen}
                  disabled={!isStreaming}
                />
              </div>

              {/* Real-time viewer count overlay */}
              {isStreaming && (
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 bg-opacity-80 text-white px-3 py-2 rounded-lg flex items-center text-sm font-medium">
                    <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse mr-2"></div>
                    <EyeOutlined className="mr-1" />
                    <span>{viewerCount} đang xem</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <Card
              title="Thông tin camera"
              className="card-shadow"
              extra={
                <Button
                  icon={<ReloadOutlined />}
                  loading={checkLoading}
                  onClick={onHealthCheck}
                >
                  Kiểm tra kết nối
                </Button>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên camera">
                  {camera.name}
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                  {camera.location}
                </Descriptions.Item>
                <Descriptions.Item label="Loại camera">
                  <Tag color="blue">{camera.type.toUpperCase()}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="URL Stream">
                  <div className="break-all text-xs">{camera.streamUrl}</div>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* <ModalCheckHealth
              modalCheck={modalCheck}
              setModalCheck={setModalCheck}
              cameraData={cameraData}
            /> */}

            <Card title="Lịch sử kiểm tra" className="card-shadow">
              <List>
                <VirtualList
                  data={statusLogs}
                  height={CONTAINER_HEIGHT}
                  itemHeight={47}
                  itemKey="id"
                >
                  {(item) => (
                    <List.Item
                      style={{ padding: '8px 0', borderBottom: 'none' }}
                    >
                      <span
                        style={{
                          color: '#888',
                          fontSize: '12px',
                          marginRight: '8px'
                        }}
                      >
                        <ClockCircleOutlined /> {item.timestamp}
                      </span>
                      <span>{renderMessage(item.message)}</span>
                    </List.Item>
                  )}
                </VirtualList>
              </List>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default CameraDetail
