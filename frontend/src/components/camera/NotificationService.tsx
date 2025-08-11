import React, { useEffect } from 'react'
import { notification } from 'antd'
import {
  WarningOutlined,
  UserOutlined,
  VideoCameraOutlined,
  WifiOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

interface NotificationServiceProps {
  motionDetection: boolean
  cameraName?: string
}

export interface MotionAlert {
  id: string
  cameraId: string
  cameraName: string
  timestamp: Date
  type: 'motion' | 'person' | 'offline' | 'online'
  thumbnailUrl?: string
  confidence?: number
}

const NotificationService: React.FC<NotificationServiceProps> = ({
  motionDetection,
  cameraName = 'Camera không xác định'
}) => {
  // Simulate motion detection alerts
  useEffect(() => {
    if (!motionDetection) return

    const interval = setInterval(() => {
      // Random chance of motion detection (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const alertTypes: MotionAlert['type'][] = [
          'motion',
          'person',
          'offline',
          'online'
        ]
        const randomType =
          alertTypes[Math.floor(Math.random() * alertTypes.length)]

        const newAlert: MotionAlert = {
          id: Date.now().toString(),
          cameraId: 'camera1',
          cameraName,
          timestamp: new Date(),
          type: randomType,
          confidence:
            randomType === 'person'
              ? Math.floor(Math.random() * 30) + 70
              : undefined
        }

        showNotification(newAlert)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [motionDetection, cameraName])

  const showNotification = (alert: MotionAlert) => {
    const getIcon = () => {
      switch (alert.type) {
        case 'motion':
          return <WarningOutlined style={{ color: '#ff4d4f' }} />
        case 'person':
          return <UserOutlined style={{ color: '#1890ff' }} />
        case 'offline':
          return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        case 'online':
          return <WifiOutlined style={{ color: '#52c41a' }} />
        default:
          return <VideoCameraOutlined style={{ color: '#1890ff' }} />
      }
    }

    const getTitle = () => {
      switch (alert.type) {
        case 'motion':
          return 'Phát hiện chuyển động!'
        case 'person':
          return `Phát hiện người (${alert.confidence}%)`
        case 'offline':
          return 'Camera mất kết nối'
        case 'online':
          return 'Camera đã kết nối lại'
        default:
          return 'Cảnh báo từ camera'
      }
    }

    const getDescription = () => {
      const timeStr = alert.timestamp.toLocaleTimeString('vi-VN')
      return `${alert.cameraName} - ${timeStr}`
    }

    const notificationType =
      alert.type === 'offline'
        ? 'error'
        : alert.type === 'online'
          ? 'success'
          : 'warning'

    notification[notificationType]({
      message: getTitle(),
      description: getDescription(),
      icon: getIcon(),
      placement: 'topRight',
      duration: alert.type === 'motion' ? 4 : 6,
      onClick: () => {
        console.log('Notification clicked:', alert)
        // You could navigate to specific camera view here
      }
    })
  }

  return null
}

export default NotificationService
