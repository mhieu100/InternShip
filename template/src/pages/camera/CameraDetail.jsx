import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Card,
    Button,
    Space,
    Badge,
    Descriptions,
    message,
    Spin,
    Row,
    Col,
    Statistic,
    Tag,
    Progress,
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
    ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { callCheckHealthCamera, callGetCameraById } from '../../services/api'
import JSMpeg from '@cycjimmy/jsmpeg-player'


const CameraDetail = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const videoRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [camera, setCamera] = useState(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [healthStatus, setHealthStatus] = useState(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [player, setPlayer] = useState({})
    const [statusLogs, setStatusLogs] = useState([])

    useEffect(() => {
        if (id) {
            loadCameraData()
        }
    }, [id])

    const addStatusLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setStatusLogs((prev) => [{ message, timestamp }, ...prev].slice(0, 100));
    };
    console.log(isStreaming)
    useEffect(() => {
        const interval = setInterval(() => {
            if (isStreaming) {
                checkCameraHealth()

            }
        }, 5000)

        return () => clearInterval(interval)
    }, [isStreaming])

    const loadCameraData = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await callGetCameraById(id)
            setCamera(response.data)
            addStatusLog(`Loaded camera: ${response.data.name}`)

        } catch (error) {
            console.error('Error loading camera data:', error)
            message.error('Không thể tải thông tin camera')
            navigate('/camera')
        } finally {
            setLoading(false)
        }
    }


    const checkCameraHealth = async () => {
        if (!id) return

        try {
            const response = await callCheckHealthCamera(id)
            setHealthStatus(response.data)
            console.log(response.data)
            addStatusLog(`Checked health : ${response.data.live ? 'Online' : 'Offline'} - ${response.data.ping + 'ms'}`)
        } catch (error) {
            console.error('Error checking camera health:', error)
        }
    }

    const startStream = (cameraId) => {
        const canvas = document.getElementById(`camera-${cameraId}`);
        if (!canvas) return;

        addStatusLog(`Starting stream for camera ${cameraId}`);

        try {
            const wsUrl = `ws://localhost:8083/stream?cameraId=${cameraId}`;
            const player = new JSMpeg.Player(wsUrl, {
                canvas,
                autoplay: true,
                audio: true,
                pauseWhenHidden: false,
                videoBufferSize: 1024 * 1024,
                onSourceEstablished: () => {
                    addStatusLog(`Stream established for camera ${cameraId}`);
                },
                onError: (error) => {
                    addStatusLog(`Stream error for camera ${cameraId}`);
                    console.error(`Stream error for camera ${cameraId}:`, error);
                    stopStream(cameraId);
                },
            });
            setPlayer(player)

            return true;
        } catch (error) {
            addStatusLog(`Failed to start stream for camera ${cameraId}`);
            console.error(`Failed to start stream for camera ${cameraId}:`, error);
        }
    };

    const stopStream = () => {
        if (player) {
            player.destroy();
            addStatusLog(`Stream stopped for camera ${id}`);
            return true;
        }
    };

    const handleStreamToggle = async () => {
        if (!id) return

        try {
            if (isStreaming) {
                stopStream()
                await new Promise(resolve => setTimeout(resolve, 300));
                const infoResponse = await callGetCameraById(id)
                if (infoResponse) {
                    setIsStreaming(false)
                    setCamera(infoResponse.data)
                }

            } else {

                startStream(id)
                await new Promise(resolve => setTimeout(resolve, 300));
                const infoResponse = await callGetCameraById(id)
                if (infoResponse) {
                    setIsStreaming(true)
                    setCamera(infoResponse.data)
                }

            }
        } catch (error) {
            console.error('Error toggling stream:', error)
            message.error('Không thể thay đổi trạng thái stream')
        }
    }

    const handleTakeScreenshot = async () => {
        if (!id) return
        try {
            const response = await cameraService.takeCameraScreenshot(id)
            setScreenshot(response.data.imageUrl)
            message.success('Chụp ảnh màn hình thành công')
        } catch (error) {
            console.error('Error taking screenshot:', error)
            message.error('Không thể chụp ảnh màn hình')
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
            ["ONLINE"]: 'Trực tuyến',
            ["OFFLINE"]: 'Ngoại tuyến',
            ["MAINTENANCE"]: 'Bảo trì',
            ["ERROR"]: 'Lỗi'
        }
        return texts[status]
    }






    if (loading) {
        return (
            <div className="flex-center min-h-[400px]">
                <Spin size="large" />
            </div>
        )
    }

    if (!camera) {
        return (
            <div className="flex-center min-h-[400px]">
                <div className="text-center">
                    <h3>Không tìm thấy camera</h3>
                    <Button onClick={() => navigate('/camera-grid')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-6 p-10" >


            {/* Camera Status Alert */}
            {camera.status === "OFFLINE" && (
                <Alert
                    message="Camera ngoại tuyến"
                    description="Camera hiện tại không thể kết nối. Vui lòng kiểm tra kết nối mạng và thiết bị."
                    type="error"
                    showIcon
                    closable
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title={`Stream trực tiếp  ${camera.name}`}

                        extra={<Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/camera-grid')} >
                            Quay lại
                        </Button>}
                        className="card-shadow">
                        {camera && (
                            <div className=" p-4 bg-gray-50 rounded-lg">
                                <Row gutter={[16, 8]}>
                                    <Col span={6}>
                                        <Statistic title="Chất lượng" value={camera.quality} />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic title="FPS" value={camera.fps} />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic title="Độ phân giải" value={camera.resolution} />
                                    </Col>
                                    <Col span={6}>
                                        <Badge
                                            status={camera.live ? 'success' : 'error'}
                                            text={camera.live ? 'Đang phát trực tiếp' : 'Không phát'}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                            <canvas
                                id={`camera-${camera.id}`}
                                className="w-full h-full object-cover"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                            />
                            {/* {isStreaming && streamInfo ? (
                                // <video
                                //     ref={videoRef}
                                //     src={camera.streamUrl}
                                //     className="w-full h-full object-cover"
                                //     controls
                                //     autoPlay
                                //     muted
                                //     onError={() => {
                                //         message.error('Không thể phát stream')
                                //         setIsStreaming(false)
                                //     }}
                                // />
                                <canvas
                                    id={`camera-${camera.id}`}
                                    className="w-full h-full object-cover"
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex-center text-white">
                                    <div className="text-center">
                                        <VideoCameraOutlined className="text-6xl mb-4" />
                                        <p className="text-lg">
                                            {camera.status === "OFFLINE"
                                                ? 'Camera ngoại tuyến'
                                                : 'Stream chưa được bắt đầu'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )} */}

                            {/* Stream Controls */}
                            <div className="absolute bottom-4 left-4 right-4 flex-between">
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={isStreaming ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                        onClick={handleStreamToggle}
                                        disabled={camera.status === "OFFLINE"}
                                    >
                                        {isStreaming ? 'Dừng' : 'Phát'}
                                    </Button>
                                    <Button
                                        icon={<CameraOutlined />}
                                        onClick={handleTakeScreenshot}
                                        disabled={!isStreaming}
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
                        </div>


                    </Card>

                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                        <Card title="Thông tin camera" className="card-shadow" extra={
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={checkCameraHealth}
                            >
                                Kiểm tra kết nối
                            </Button>
                        }>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Trạng thái">
                                    <Badge
                                        status={getCameraStatusColor(camera.status)}
                                        text={getCameraStatusText(camera.status)}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Vị trí">
                                    {camera.location}
                                </Descriptions.Item>
                                <Descriptions.Item label="Loại camera">
                                    <Tag color="blue">{camera.type.toUpperCase()}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Độ phân giải">
                                    {camera.resolution}
                                </Descriptions.Item>
                                <Descriptions.Item label="URL Stream">
                                    <div className="break-all text-xs">{camera.streamUrl}</div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {healthStatus && (
                            <Card title="Tình trạng kết nối" className="card-shadow">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div className="flex-between">
                                        <span>Trạng thái:</span>
                                        <Badge
                                            status={healthStatus.live ? 'success' : 'error'}
                                            text={healthStatus.live ? 'Online' : 'Offline'}
                                        />
                                    </div>

                                    <div className="flex-between">
                                        <span>Ping:</span>
                                        <span className={healthStatus.ping < 100 ? 'text-green-600' : 'text-orange-600'}>
                                            {healthStatus.ping}ms
                                        </span>
                                    </div>

                                    <div className="flex-between">
                                        <span>Kiểm tra cuối:</span>
                                        <span className="text-sm text-gray-600">
                                            {dayjs(healthStatus.lastChecked).format('HH:mm:ss')}
                                        </span>
                                    </div>

                                    {healthStatus.errorMessage && (
                                        <Alert
                                            message="Lỗi kết nối"
                                            description={healthStatus.errorMessage}
                                            type="error"
                                            size="small"
                                        />
                                    )}

                                    {/* Response Time Chart */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Chất lượng kết nối:</p>
                                        <Progress
                                            percent={Math.max(0, 100 - (healthStatus.ping / 10))}
                                            strokeColor={{
                                                '0%': '#ff4d4f',
                                                '50%': '#faad14',
                                                '100%': '#52c41a',
                                            }}
                                            size="small"
                                        />
                                    </div>
                                </Space>
                            </Card>
                        )}


                        <Card title="Lịch sử kiểm tra" className="card-shadow">
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
                        </Card>


                    </Space>
                </Col>
            </Row>


        </div>
    )
}

export default CameraDetail