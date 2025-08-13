import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Switch,
  Slider,
  Badge,
  notification,
  Tooltip,
  Drawer,
  List,
  Space,
  Typography,
  Divider,
  Progress,
  message,
  Timeline,
  Dropdown,
  MenuProps
} from 'antd'
import {
  CameraOutlined,
  VideoCameraOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  SettingOutlined,
  ReloadOutlined,
  WarningOutlined,
  EyeOutlined,
  MenuOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  NotificationOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  VideoCameraAddOutlined,
  StopOutlined,
  AudioOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import NotificationService from '../../components/camera/NotificationService'
import { callGetPublicCameras } from 'services/camera.api'
import { ICamera } from 'types/backend'
import JSMpeg from '@cycjimmy/jsmpeg-player'

const { Title, Text } = Typography

interface MotionEvent {
  id: string
  cameraId: string
  timestamp: string
  description: string
  thumbnailUrl?: string
}

const CameraPage = () => {
  const isMountedRef = useRef(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const playerRef = useRef<JSMpeg.Player | null>(null)

  const [selectedCamera, setSelectedCamera] = useState<ICamera | null>(null)
  const [cameras, setCameras] = useState<ICamera[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [motionDetection, setMotionDetection] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [videoQuality, setVideoQuality] = useState('HD')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showEventHistory, setShowEventHistory] = useState(false)
  const [gridMode, setGridMode] = useState('1x1')
  const [networkStatus, setNetworkStatus] = useState({ speed: 85, latency: 45 })
  const videoRef = useRef<HTMLVideoElement>(null)

  console.log(cameras)
  const motionEvents: MotionEvent[] = [
    {
      id: '1',
      cameraId: 'camera1',
      timestamp: '2025-08-11 14:30:25',
      description: 'Phát hiện chuyển động tại phòng khách'
    },
    {
      id: '2',
      cameraId: 'camera2',
      timestamp: '2025-08-11 14:25:10',
      description: 'Có người tại cửa chính'
    },
    {
      id: '3',
      cameraId: 'camera1',
      timestamp: '2025-08-11 14:20:45',
      description: 'Chuyển động bất thường phát hiện'
    }
  ]
  const fetchPublicCamera = async () => {
    try {
      const response = await callGetPublicCameras()
      if (response.data) {
        setCameras(response.data.result)
      }
    } catch (error) {
      console.error('Error fetching public cameras:', error)
    }
  }
  const currentCamera = cameras.find((c) => c.id === selectedCamera?.id)

  const handleStreamToggle = async () => {
    if (!selectedCamera) return

    // Check if camera is offline
    if (currentCamera?.status === 'OFFLINE') {
      message.error('Không thể bắt đầu stream - Camera đang offline')
      return
    }

    try {
      if (isStreaming) {
        stopStream()
        await new Promise((resolve) => setTimeout(resolve, 300))
        setIsStreaming(false)
      } else {
        startStream(currentCamera.id)
        await new Promise((resolve) => setTimeout(resolve, 300))
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error toggling stream:', error)
      message.error('Không thể thay đổi trạng thái stream')
    }
  }

  const startStream = async (cameraId: number) => {
    if (!isMountedRef.current) return false

    const canvas = document.getElementById(`camera-${cameraId}`)
    if (!canvas) return

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
            setIsStreaming(true)
          }
        },
        onError: (error) => {
          if (isMountedRef.current) {
            stopStream()
          }
        }
      })

      playerRef.current = newPlayer
      return true
    } catch (error) {
      if (isMountedRef.current) {
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
      return true
    } catch (error) {
      return false
    } finally {
      playerRef.current = null
      if (isMountedRef.current) {
        setIsStreaming(false)
        setViewerCount(0)
      }
    }
  }

  useEffect(() => {
    fetchPublicCamera()
    const interval = setInterval(() => {
      setNetworkStatus({
        speed: Math.floor(Math.random() * 30) + 70,
        latency: Math.floor(Math.random() * 20) + 30
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  const handleSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx && videoRef.current.videoWidth && videoRef.current.videoHeight) {
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)

        const link = document.createElement('a')
        link.download = `snapshot-${selectedCamera}-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()

        message.success('Đã chụp ảnh thành công!')
      }
    }
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      message.success('Bắt đầu ghi video...')
    } else {
      message.success('Đã dừng ghi video!')
    }
  }

  const handlePTZControl = (direction: string) => {
    message.info(`Điều khiển camera: ${direction}`)
  }

  const handleZoom = (value: number) => {
    setZoomLevel(value)
  }

  const handleMotionAlert = () => {
    notification.warning({
      message: 'Phát hiện chuyển động!',
      description: `${currentCamera?.name} - ${new Date().toLocaleString()}`,
      placement: 'topRight',
      icon: <WarningOutlined style={{ color: '#ff4d4f' }} />
    })
  }

  const qualityOptions = [
    { label: 'SD (480p)', value: 'SD' },
    { label: 'HD (720p)', value: 'HD' },
    { label: 'Full HD (1080p)', value: 'FHD' },
    { label: 'Ultra HD (4K)', value: 'UHD' }
  ]

  const gridOptions = [
    { label: '1x1', value: '1x1' },
    { label: '2x2', value: '2x2' },
    { label: '3x3', value: '3x3' },
    { label: '4x4', value: '4x4' }
  ]

  const shareMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Chia sẻ liên kết',
      icon: <ShareAltOutlined />
    },
    {
      key: '2',
      label: 'Tải xuống video',
      icon: <DownloadOutlined />
    },
    {
      key: '3',
      label: 'Gửi email',
      icon: <NotificationOutlined />
    }
  ]

  const renderVideoPlayer = (camera: ICamera, isMain = false) => (
    <div
      className={`relative ${
        isMain ? 'h-full' : 'h-48'
      } overflow-hidden rounded-lg bg-black`}
    >
      {camera && camera.status === 'ONLINE' ? (
        <>
          {/* <video ...existing code... */}

          <canvas
            id={`camera-${camera.id}`}
            className="size-full object-cover"
            style={{ transform: `scale(${isMain ? zoomLevel : 1})` }}
          />

          {/* Canvas Action Buttons */}
          {isMain && (
            <div className="absolute bottom-16 right-4 flex flex-col space-y-2 z-20">
              <Tooltip title="Chụp ảnh">
                <Button
                  shape="circle"
                  icon={<CameraOutlined />}
                  onClick={handleSnapshot}
                  disabled={currentCamera?.status !== 'online'}
                />
              </Tooltip>
              <Tooltip title={isRecording ? 'Dừng ghi' : 'Ghi video'}>
                <Button
                  shape="circle"
                  icon={
                    isRecording ? <StopOutlined /> : <VideoCameraAddOutlined />
                  }
                  onClick={handleRecording}
                  danger={isRecording}
                  disabled={currentCamera?.status !== 'online'}
                />
              </Tooltip>
            </div>
          )}

          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            <div className="flex items-center space-x-2">
              <Badge status="processing" />
              <span>{camera.name}</span>
            </div>
            <div className="text-xs opacity-75">
              {new Date().toLocaleString()}
            </div>
          </div>

          {isRecording && isMain && (
            <div className="absolute right-2 top-2 flex items-center rounded bg-red-600 px-2 py-1 text-xs text-white">
              <div className="mr-1 size-2 animate-pulse rounded-full bg-white" />
              REC
            </div>
          )}

          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <Tooltip
              title={`Tốc độ: ${networkStatus.speed}Mbps | Độ trễ: ${networkStatus.latency}ms`}
            >
              <WifiOutlined className="text-green-400" />
            </Tooltip>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          <div className="text-center">
            <VideoCameraOutlined className="mb-2 text-4xl" />
            <div>Camera Offline</div>
          </div>
        </div>
      )}
    </div>
  )

  const renderPTZControls = () =>
    currentCamera?.hasPTZ && (
      <Card size="small" title="Điều khiển PTZ" className="mb-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div></div>
          <Button
            icon={<ArrowUpOutlined />}
            onClick={() => handlePTZControl('up')}
            className="h-10"
          />
          <div></div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => handlePTZControl('left')}
            className="h-10"
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePTZControl('home')}
            className="h-10"
          />
          <Button
            icon={<ArrowRightOutlined />}
            onClick={() => handlePTZControl('right')}
            className="h-10"
          />
          <div></div>
          <Button
            icon={<ArrowDownOutlined />}
            onClick={() => handlePTZControl('down')}
            className="h-10"
          />
          <div></div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Text>Zoom:</Text>
            <div className="ml-4 flex flex-1 items-center space-x-2">
              <Button
                size="small"
                icon={<ZoomOutOutlined />}
                onClick={() => handleZoom(Math.max(0.5, zoomLevel - 0.1))}
              />
              <Slider
                min={0.5}
                max={3}
                step={0.1}
                value={zoomLevel}
                onChange={handleZoom}
                className="mx-2 flex-1"
              />
              <Button
                size="small"
                icon={<ZoomInOutlined />}
                onClick={() => handleZoom(Math.min(3, zoomLevel + 0.1))}
              />
            </div>
          </div>
        </div>
      </Card>
    )

  return (
    <div className="h-screen bg-gray-50 p-4">
      <Row gutter={[16, 16]} className="h-full">
        {/* Left Sidebar - Camera List */}
        <Col xs={24} lg={6} className="h-full">
          <div className="flex h-full flex-col space-y-4">
            {/* Camera Selection */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>Danh sách Camera</span>
                </div>
              }
              size="small"
              className="shrink-0"
            >
              <List
                dataSource={cameras}
                renderItem={(camera) => (
                  <List.Item
                    className={`cursor-pointer rounded p-2 ${
                      selectedCamera === camera.id
                        ? 'border border-blue-200 bg-blue-50'
                        : ''
                    }`}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge
                          status={
                            camera.status === 'ONLINE' ? 'processing' : 'error'
                          }
                        />
                      }
                      title={<Text className="text-sm">{camera.name}</Text>}
                      description={
                        <div className="flex items-center justify-between">
                          <Text type="secondary" className="text-xs">
                            {camera.location}
                          </Text>
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
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* PTZ Controls */}
            {renderPTZControls()}

            {/* Quick Actions */}
            <Card title="Thao tác nhanh" size="small">
              <Space direction="vertical" className="w-full">
                <Row gutter={8}>
                  <Col span={12}>
                    <Tooltip title="Chụp ảnh">
                      <Button
                        icon={<CameraOutlined />}
                        onClick={handleSnapshot}
                        block
                        disabled={currentCamera?.status !== 'online'}
                      >
                        Chụp ảnh
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <Tooltip title={isRecording ? 'Dừng ghi' : 'Ghi video'}>
                      <Button
                        icon={
                          isRecording ? (
                            <StopOutlined />
                          ) : (
                            <VideoCameraAddOutlined />
                          )
                        }
                        onClick={handleRecording}
                        danger={isRecording}
                        block
                        disabled={currentCamera?.status !== 'online'}
                      >
                        {isRecording ? 'Dừng' : 'Ghi'}
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>

                <Divider className="my-2" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text className="text-sm">Phát hiện chuyển động:</Text>
                    <Switch
                      checked={motionDetection}
                      onChange={setMotionDetection}
                      size="small"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Text className="text-sm">Âm thanh:</Text>
                    <Switch
                      checked={audioEnabled}
                      onChange={setAudioEnabled}
                      size="small"
                      disabled={!currentCamera?.hasAudio}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Text className="text-sm">Microphone:</Text>
                    <Switch
                      checked={micEnabled}
                      onChange={setMicEnabled}
                      size="small"
                      disabled={!currentCamera?.hasAudio}
                    />
                  </div>
                </div>
              </Space>
            </Card>

            {/* Network Status */}
            <Card title="Trạng thái mạng" size="small">
              <Space direction="vertical" className="w-full">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Tốc độ</span>
                    <span>{networkStatus.speed}Mbps</span>
                  </div>
                  <Progress
                    percent={networkStatus.speed}
                    size="small"
                    status={networkStatus.speed > 50 ? 'normal' : 'exception'}
                    showInfo={false}
                  />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Độ trễ</span>
                    <span>{networkStatus.latency}ms</span>
                  </div>
                  <Progress
                    percent={100 - networkStatus.latency}
                    size="small"
                    status={
                      networkStatus.latency < 100 ? 'normal' : 'exception'
                    }
                    showInfo={false}
                  />
                </div>
              </Space>
            </Card>
          </div>
        </Col>

        {/* Main Video Area */}
        <Col xs={24} lg={18} className="h-full">
          <Card
            className="h-full"
            bodyStyle={{ height: 'calc(100% - 100px)', padding: 0 }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Title level={5} className="mb-0">
                    {currentCamera?.name}
                  </Title>
                  <Badge
                    status={
                      currentCamera?.status === 'online'
                        ? 'processing'
                        : 'error'
                    }
                  />
                </div>

                <Space>
                  {/* Grid Mode */}
                  <Select
                    value={gridMode}
                    onChange={setGridMode}
                    options={gridOptions}
                    size="small"
                    style={{ width: 80 }}
                  />

                  {/* Quality Selector */}
                  <Select
                    value={videoQuality}
                    onChange={setVideoQuality}
                    options={qualityOptions}
                    size="small"
                    style={{ width: 120 }}
                  />

                  {/* Audio Controls */}
                  {currentCamera?.hasAudio && (
                    <>
                      <Tooltip
                        title={audioEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                      >
                        <Button
                          icon={
                            audioEnabled ? (
                              <SoundOutlined />
                            ) : (
                              <AudioMutedOutlined />
                            )
                          }
                          onClick={() => setAudioEnabled(!audioEnabled)}
                          size="small"
                        />
                      </Tooltip>

                      <Tooltip title={micEnabled ? 'Tắt mic' : 'Bật mic'}>
                        <Button
                          icon={<AudioOutlined />}
                          onClick={() => setMicEnabled(!micEnabled)}
                          type={micEnabled ? 'primary' : 'default'}
                          size="small"
                        />
                      </Tooltip>
                    </>
                  )}

                  {/* Share */}
                  <Dropdown
                    menu={{ items: shareMenuItems }}
                    placement="bottomRight"
                  >
                    <Button icon={<ShareAltOutlined />} size="small">
                      Chia sẻ
                    </Button>
                  </Dropdown>

                  {/* Fullscreen */}
                  <Tooltip
                    title={
                      isFullScreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'
                    }
                  >
                    <Button
                      icon={
                        isFullScreen ? (
                          <FullscreenExitOutlined />
                        ) : (
                          <FullscreenOutlined />
                        )
                      }
                      onClick={handleFullScreen}
                      size="small"
                    />
                  </Tooltip>

                  {/* Refresh */}
                  <Tooltip title="Làm mới">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        message.success('Đã làm mới kết nối!')
                      }}
                      size="small"
                    />
                  </Tooltip>

                  {/* Settings */}
                  <Tooltip title="Cài đặt">
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setShowSettings(true)}
                      size="small"
                    />
                  </Tooltip>

                  {/* Event History */}
                  <Tooltip title="Lịch sử sự kiện">
                    <Button
                      icon={<ClockCircleOutlined />}
                      onClick={() => setShowEventHistory(true)}
                      size="small"
                    />
                  </Tooltip>
                </Space>
              </div>
            }
          >
            <div className="h-full">
              {gridMode === '1x1' ? (
                renderVideoPlayer(currentCamera!, true)
              ) : (
                <div
                  className={`grid ${
                    gridMode === '2x2'
                      ? 'grid-cols-2'
                      : gridMode === '3x3'
                        ? 'grid-cols-3'
                        : 'grid-cols-4'
                  } h-full gap-2`}
                >
                  {cameras
                    .slice(0, parseInt(gridMode.split('x')[0]) ** 2)
                    .map((camera) => (
                      <div
                        key={camera.id}
                        onClick={() => setSelectedCamera(camera)}
                        className="cursor-pointer hover:opacity-80"
                      >
                        {renderVideoPlayer(camera)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Drawer
        title="Cài đặt Camera"
        placement="right"
        onClose={() => setShowSettings(false)}
        open={showSettings}
        width={400}
      >
        <Space direction="vertical" className="w-full">
          <Card title="Chất lượng Video" size="small">
            <Select
              value={videoQuality}
              onChange={setVideoQuality}
              options={qualityOptions}
              className="w-full"
            />
            <div className="mt-2 text-xs text-gray-500">
              Chất lượng cao hơn sẽ tiêu tốn nhiều băng thông hơn
            </div>
          </Card>

          <Card title="Thông báo" size="small">
            <Space direction="vertical" className="w-full">
              <div className="flex items-center justify-between">
                <Text>Thông báo chuyển động:</Text>
                <Switch
                  checked={motionDetection}
                  onChange={setMotionDetection}
                />
              </div>
              <div className="flex items-center justify-between">
                <Text>Thông báo âm thanh:</Text>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Text>Email thông báo:</Text>
                <Switch />
              </div>
            </Space>
          </Card>

          <Card title="Bảo mật" size="small">
            <Space direction="vertical" className="w-full">
              <Button block>Thay đổi mật khẩu</Button>
              <Button block>Cài đặt 2FA</Button>
              <Button block danger>
                Báo cáo sự cố
              </Button>
            </Space>
          </Card>
        </Space>
      </Drawer>

      {/* Event History Drawer */}
      <Drawer
        title="Lịch sử Sự kiện"
        placement="right"
        onClose={() => setShowEventHistory(false)}
        open={showEventHistory}
        width={400}
      >
        <Timeline
          items={motionEvents.map((event) => ({
            children: (
              <div>
                <Text strong>{event.description}</Text>
                <br />
                <Text type="secondary" className="text-xs">
                  {event.timestamp}
                </Text>
              </div>
            ),
            color: 'red'
          }))}
        />
      </Drawer>

      {/* Motion Detection Alert */}
      {motionDetection && (
        <Button
          onClick={handleMotionAlert}
          className="fixed bottom-4 right-4 z-50"
          type="primary"
          danger
          size="large"
          icon={<WarningOutlined />}
        >
          Test Motion Alert
        </Button>
      )}

      {/* Notification Service */}
      <NotificationService
        motionDetection={motionDetection}
        cameraName={currentCamera?.name}
      />
    </div>
  )
}

export default CameraPage
