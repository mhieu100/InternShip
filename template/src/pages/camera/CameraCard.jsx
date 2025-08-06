import { useEffect, useRef, useState } from 'react'
import {
    Card,
    Button,
    Badge,
    Tooltip,
    message,
    Tag,
    Spin,
    Modal,
} from 'antd'
import {
    VideoCameraOutlined,
    ReloadOutlined,
    FullscreenOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'
import JSMpeg from '@cycjimmy/jsmpeg-player'
import { callCheckHealthCamera } from '../../services/api'
import ModalCheckHealth from '../../components/features/modals/modal.check'
import { getCameraStatusColor, getCameraStatusText } from '../../utils/status.color'


const CameraCard = ({
    camera,
    onViewDetails,
    healthStatus,
}) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalCheck, setModalCheck] = useState(false);
    const [cameraData, setCameraData] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const playerRef = useRef(null);
    const isMountedRef = useRef(true);
    const canvasRef = useRef(null);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            stopStream();
        };
    }, []);

    const startStream = async (cameraId) => {
        if (!isMountedRef.current) return false;

        setIsLoading(true);

        try {
            if (!canvasRef.current) {
                console.error("Canvas chưa sẵn sàng");
                return false;
            }

            const wsUrl = `ws://localhost:8083/stream?cameraId=${cameraId}`;
            const newPlayer = new JSMpeg.Player(wsUrl, {
                canvas: canvasRef.current,
                autoplay: true,
                audio: false,
                disableWebAssembly: true,
                onSourceEstablished: () => {
                    if (isMountedRef.current) {
                        setIsStreaming(true);
                        setIsLoading(false);
                    }
                },
                onError: (error) => {
                    console.error("JSMpeg error:", error);
                    if (isMountedRef.current) {
                        setIsLoading(false);
                        stopStream();
                    }
                }
            });

            playerRef.current = newPlayer;
            return true;
        } catch (error) {
            console.error("Khởi tạo player thất bại:", error);
            if (isMountedRef.current) {
                setIsLoading(false);
            }
            return false;
        }
    };

    const stopStream = () => {
        if (!playerRef.current) return false;

        try {
            if (playerRef.current.ws &&
                playerRef.current.ws.readyState === WebSocket.OPEN) {
                playerRef.current.ws.close(1000);
            }

            playerRef.current.destroy();
            return true;
        } catch (error) {
            console.error("Lỗi khi dừng stream:", error);
            return false;
        } finally {
            playerRef.current = null;
            if (isMountedRef.current) {
                setIsStreaming(false);
            }
        }
    };

    const handleStreamToggle = async () => {
        if (!camera.id) return;

        try {
            if (isStreaming) {
                await stopStream();
            } else {
                await startStream(camera.id);
            }


        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái stream:", error);
            if (isMountedRef.current) {
                message.error("Thao tác thất bại");
            }
        }
    };

    

    const onHealthCheck = async (cameraId) => {
        if (!cameraId) return;

        setCheckLoading(true);
        try {
            const response = await callCheckHealthCamera(cameraId);
            setCameraData(response.data);
            setModalCheck(true);
        } catch (error) {
            console.error('Error checking camera health:', error);
        } finally {
            setCheckLoading(false);
        }
    };

    return (
        <Card
            className="card-shadow hover:shadow-lg transition-shadow duration-200"
            cover={
                <div className="relative bg-gray-900 h-48 flex-center overflow-hidden">
                    <canvas
                        id={`camera-${camera.id}`}
                        ref={canvasRef}
                        className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />

                    {camera.status === "ONLINE" ? (
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
                        <div className="relative w-full h-full">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <ExclamationCircleOutlined className="text-4xl mb-2" />
                                <p>Camera ngoại tuyến</p>
                            </div>
                        </div>
                    )}


                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <Spin size="large" />
                        </div>
                    )}

                    {isStreaming && (
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black bg-opacity-50 text-white px-3 py-1 rounded text-xs">
                            <span>{camera.resolution} •</span>
                            <span>{camera.fps} FPS</span>
                        </div>
                    )}

                    <div className="absolute top-2 left-2">
                        <Badge
                            status={getCameraStatusColor(camera.status)}
                            text={
                                <span className="flex items-center space-x-1 text-white">
                                    <span>{getCameraStatusText(camera.status)}</span>
                                </span>
                            }
                            className="bg-black bg-opacity-50 text-white px-2 py-1 rounded"
                        />
                    </div>

                    {healthStatus && (
                        <div className="absolute top-2 right-2">
                            <Tooltip title={`Độ trễ: ${healthStatus.responseTime}ms`}>
                                <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded flex items-center">
                                    {healthStatus.isOnline ? (
                                        <CheckCircleOutlined className="text-green-400" />
                                    ) : (
                                        <ExclamationCircleOutlined className="text-red-400" />
                                    )}
                                    <span className={`ml-1 text-xs ${healthStatus.responseTime < 100 ? 'text-green-400' : 'text-orange-400'
                                        }`}>
                                        {healthStatus.responseTime}ms
                                    </span>
                                </div>
                            </Tooltip>
                        </div>
                    )}
                </div>
            }
            actions={[
                <Tooltip title="Kiểm tra kết nối" key="health">
                    <Button
                        type="text"
                        loading={checkLoading}
                        disabled={checkLoading}
                        icon={<ReloadOutlined />}
                        onClick={() => onHealthCheck(camera.id)}
                    />
                    <ModalCheckHealth modalCheck={modalCheck} setModalCheck={setModalCheck} cameraData={cameraData} />
                </Tooltip>,
                <Tooltip title={isStreaming ? "Dừng phát" : "Bắt đầu phát"} key="stream">
                    <Button
                        type="text"
                        icon={isStreaming ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        onClick={handleStreamToggle}
                        disabled={camera.status === "OFFLINE"}
                    />
                </Tooltip>,
                <Tooltip title="Xem chi tiết" key="details">
                    <Button
                        type="text"
                        icon={<FullscreenOutlined />}
                        onClick={() => onViewDetails(camera.id)}
                    />
                </Tooltip>
            ]}
        >
            <Card.Meta
                title={
                    <div className="flex justify-between items-center">
                        <span className="truncate font-medium">{camera.name}</span>
                        <Tag color="blue" className="uppercase">
                            {camera.type}
                        </Tag>
                    </div>
                }
                description={
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 truncate">
                            <span className="inline-block w-5">📍</span> {camera.location}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="inline-block w-5">🎥</span> {camera.resolution} • {camera.fps}FPS
                        </p>
                        {camera.lastPing && (
                            <p className="text-xs text-gray-500">
                                <span className="inline-block w-5">🕒</span>
                                Cập nhật: {new Date(camera.lastPing).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                }
            />
        </Card>
    )
}

export default CameraCard