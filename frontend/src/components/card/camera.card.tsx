import { useEffect, useRef, useState } from 'react'
import { Card, Button, Badge, Tooltip, message, Tag, Spin } from 'antd'
import {
  VideoCameraOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LockFilled
} from '@ant-design/icons'
import JSMpeg from '@cycjimmy/jsmpeg-player'

import {
  getCameraStatusColor,
  getCameraStatusText
} from '../../utils/status.color'
import { ICamera } from 'types/backend'
import ModalSecure from 'components/modal/modal.sercure'

interface IProps {
  camera: ICamera
  onViewDetails: (id: number) => void
}

const CameraCard = (props: IProps) => {
  const { camera, onViewDetails } = props
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const playerRef = useRef(null)
  const isMountedRef = useRef(true)
  const canvasRef = useRef(null)
  const [modalSecure, setModalSecure] = useState(false)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopStream()
    }
  }, [])

  const handleSecure = async (email: string, password: string) => {
    if (email === 'demo@gmail.com' && password === '123456') {
      await startStream(Number(camera.id))
      return
    }
    return message.error('username or password wrong')
  }

  useEffect(() => {
    if (camera?.status === 'OFFLINE' && isStreaming) {
      stopStream()
    }
  }, [camera?.status, isStreaming])

  const startStream = async (cameraId: number) => {
    if (!isMountedRef.current) return false

    setIsLoading(true)

    try {
      if (!canvasRef.current) {
        console.error('Canvas chưa sẵn sàng')
        return false
      }

      const wsUrl = `ws://localhost:8085/stream?cameraId=${cameraId}`
      const newPlayer = new JSMpeg.Player(wsUrl, {
        canvas: canvasRef.current,
        autoplay: true,
        audio: false,
        disableWebAssembly: true,
        onSourceEstablished: () => {
          if (isMountedRef.current) {
            setIsStreaming(true)
            setIsLoading(false)
          }
        },
        onError: (error) => {
          console.error('JSMpeg error:', error)
          if (isMountedRef.current) {
            setIsLoading(false)
            stopStream()
          }
        }
      })

      playerRef.current = newPlayer
      return true
    } catch (error) {
      console.error('Khởi tạo player thất bại:', error)
      if (isMountedRef.current) {
        setIsLoading(false)
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
      console.error('Lỗi khi dừng stream:', error)
      return false
    } finally {
      playerRef.current = null
      if (isMountedRef.current) {
        setIsStreaming(false)
      }
    }
  }

  const handleStreamToggle = async () => {
    if (!camera.id) return

    if (camera?.status === 'OFFLINE') {
      message.error('Không thể bắt đầu stream - Camera đang offline')
      return
    }

    try {
      if (!isStreaming) {
        if (!camera.isPublic) {
          setModalSecure(true)
          return
        }
        await startStream(Number(camera.id))
      } else {
        await stopStream()
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái stream:', error)
      if (isMountedRef.current) {
        message.error('Thao tác thất bại')
      }
    }
  }

  return (
    <Card
      className="transition-shadow duration-200 hover:shadow-lg"
      cover={
        <div className="relative h-48 overflow-hidden bg-gray-900">
          <canvas
            id={`camera-${camera.id}`}
            ref={canvasRef}
            className={`size-full object-cover ${
              isStreaming ? 'block' : 'hidden'
            }`}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />

          {camera.status === 'ONLINE' ? (
            !isStreaming && (
              <div className="relative size-full">
                <img
                  src="https://hi-static.fpt.vn/sys/hifpt/fsh/smarthome/img/post_item/camera-chong-trom-7.jpg"
                  alt="Camera placeholder"
                  className="size-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <VideoCameraOutlined className="mb-2 text-4xl" />
                  <p>Ấn phát để xem trực tiếp</p>
                </div>
              </div>
            )
          ) : (
            <div className="relative size-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <ExclamationCircleOutlined className="mb-2 text-4xl" />
                <p>Camera ngoại tuyến</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <Spin size="large" />
            </div>
          )}

          {isStreaming && (
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded bg-black px-3 py-1 text-xs text-white">
              <span>{camera.resolution} •</span>
              <div className="flex items-center space-x-2">
                <span>{camera.fps} FPS</span>
                <span className="flex items-center">
                  <EyeOutlined className="mr-1" />
                  {camera.viewerCount || 0}
                </span>
              </div>
            </div>
          )}

          <div className="absolute left-2 top-2">
            <Badge
              status={getCameraStatusColor(camera.status)}
              text={
                <span className="flex items-center space-x-1 text-white">
                  <span>{getCameraStatusText(camera.status)}</span>
                </span>
              }
              className="rounded bg-black px-2 py-1 text-white"
            />
          </div>

          <div className="absolute right-2 top-2 flex items-center space-x-2">
            {camera.status === 'ONLINE' && (camera.viewerCount || 0) > 0 && (
              <Tooltip title={`${camera.viewerCount} người đang xem`}>
                <div className="flex items-center rounded bg-red-500 px-2 py-1 text-xs text-white">
                  <EyeOutlined className="mr-1" />
                  {camera.viewerCount}
                </div>
              </Tooltip>
            )}

            {!camera.isPublic && (
              <div className="flex items-center rounded bg-blue-600 px-2 py-1 text-xs text-white">
                <LockFilled className="mr-1" />
              </div>
            )}

            {/* {healthStatus && (
              <Tooltip title={`Độ trễ: ${healthStatus.responseTime}ms`}>
                <div className="flex items-center rounded bg-black bg-opacity-50 px-2 py-1 text-white">
                  {healthStatus.isOnline ? (
                    <CheckCircleOutlined className="text-green-400" />
                  ) : (
                    <ExclamationCircleOutlined className="text-red-400" />
                  )}
                  <span
                    className={`ml-1 text-xs ${
                      healthStatus.responseTime < 100
                        ? 'text-green-400'
                        : 'text-orange-400'
                    }`}
                  >
                    {healthStatus.responseTime}ms
                  </span>
                </div>
              </Tooltip>
            )} */}
          </div>
        </div>
      }
      actions={[
        <Tooltip title="Kiểm tra kết nối" key="health">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={() => message.success('camera oke')}
          />
        </Tooltip>,
        <Tooltip
          title={isStreaming ? 'Dừng phát' : 'Bắt đầu phát'}
          key="stream"
        >
          <Button
            type="text"
            icon={
              isStreaming ? <PauseCircleOutlined /> : <PlayCircleOutlined />
            }
            onClick={handleStreamToggle}
            disabled={camera.status === 'OFFLINE'}
          />
          <ModalSecure
            open={modalSecure}
            setOpen={setModalSecure}
            handleSecure={handleSecure}
          />
        </Tooltip>,
        <Tooltip title="Xem chi tiết" key="details">
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={() => onViewDetails(Number(camera.id))}
          />
        </Tooltip>
      ]}
    >
      <Card.Meta
        title={
          <div className="flex items-center justify-between">
            <span className="truncate font-medium">{camera.name}</span>
            <Tag color="blue" className="uppercase">
              {camera.type}
            </Tag>
          </div>
        }
        description={
          <div className="space-y-2">
            <p className="truncate text-sm text-gray-600">
              <span className="inline-block w-5">📍</span> {camera.location}
            </p>
            <p className="text-sm text-gray-600">
              <span className="inline-block w-5">🎥</span> {camera.resolution} •{' '}
              {camera.fps}FPS
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <EyeOutlined className="mr-1 w-5" />
              {camera.viewerCount || 0} người đang xem
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
