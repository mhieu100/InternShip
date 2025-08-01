import { useState } from 'react'
import {
    Card,
    Button,
    Badge,
    Tooltip,
    message,
    Tag,
} from 'antd'
import {
    VideoCameraOutlined,
    ReloadOutlined,
    FullscreenOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'


const CameraCard = ({
    camera,
    onHealthCheck,
    onStreamToggle,
    onViewDetails,
    healthStatus
}) => {
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamUrl, setStreamUrl] = useState('')

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

    const handleStreamToggle = async () => {
        try {
            if (isStreaming) {
                await onStreamToggle(camera.id, 'stop')
                setIsStreaming(false)
                setStreamUrl('')
            } else {
                await onStreamToggle(camera.id, 'start')
                setIsStreaming(true)
                setStreamUrl(camera.streamUrl)
            }
        } catch (error) {
            console.error('Error toggling stream:', error)
        }
    }

    return (
        <Card
            className="card-shadow hover:shadow-lg transition-shadow duration-200"
            cover={
                <div className="relative bg-gray-900 h-48 flex-center">
                    {isStreaming && streamUrl ? (
                        <video
                            src={streamUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            autoPlay
                            muted
                            onError={() => {
                                message.error(`Không thể phát stream từ camera ${camera.name}`)
                                setIsStreaming(false)
                            }}
                        />
                    ) : (
                        <div className="text-center text-white">
                            <VideoCameraOutlined className="text-4xl mb-2" />
                            <p>Camera {camera.status === "OFFLINE" ? 'ngoại tuyến' : 'chưa phát'}</p>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                        <Badge
                            status={getCameraStatusColor(camera.status)}
                            text={getCameraStatusText(camera.status)}
                            className="bg-black bg-opacity-50 text-white px-2 py-1 rounded"
                        />
                    </div>

                    {/* Health Status */}
                    {healthStatus && (
                        <div className="absolute top-2 right-2">
                            <Tooltip title={`Ping: ${healthStatus.responseTime}ms`}>
                                <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded flex items-center">
                                    {healthStatus.isOnline ? (
                                        <CheckCircleOutlined className="text-green-400" />
                                    ) : (
                                        <ExclamationCircleOutlined className="text-red-400" />
                                    )}
                                    <span className="ml-1 text-xs">{healthStatus.responseTime}ms</span>
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
                        icon={<ReloadOutlined />}
                        onClick={() => onHealthCheck(camera.id)}
                    />
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
                </Tooltip>,
                <Tooltip title="Cài đặt" key="settings">
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                    />
                </Tooltip>
            ]}
        >
            <Card.Meta
                title={
                    <div className="flex-between">
                        <span className="truncate">{camera.name}</span>
                        <Tag color="blue">{camera.type.toUpperCase()}</Tag>
                    </div>
                }
                description={
                    <div className="space-y-1">
                        <p className="text-sm text-gray-600 truncate">📍 {camera.location}</p>
                        <p className="text-sm text-gray-600">🎥 {camera.resolution}</p>
                        {camera.lastPing && (
                            <p className="text-xs text-gray-500">
                                Ping cuối: {new Date(camera.lastPing).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                }
            />
        </Card>
    )
}

export default CameraCard