export interface IBackendRes<T> {
  error?: string | string[]
  message: string
  statusCode: number | string
  data: T
}

export interface AccessTokenResponse {
  access_token: string
}

export interface IModelPaginate<T> {
  meta: {
    page: number
    pageSize: number
    pages: number
    total: number
  }
  result: T[]
}

export interface IAccount {
  access_token: string
  user: {
    id: string
    avatar: string
    name: string
    email: string
    role: string
  }
}

export interface IGetAccount {
  id: string
  avatar: string
  name: string
  email: string
  role: string
}

export interface IUser {
  id: string
  avatar?: string
  name: string
  email: string
  password?: string
  address?: string
  role?: 'USER' | 'ADMIN'
  createdAt?: string
  updatedAt?: string
}

export interface IProduct {
  id?: number
  name?: string
  price?: number
  image?: string
  category?: string
  description?: string
  rating?: number
  stock?: number
  reviews?: number
}

export interface ICamera {
  id: string
  name: string
  code: string
  location: string
  description?: string
  streamUrl: string
  status: 'ONLINE' | 'OFFLINE'
  type: 'INDOOR' | 'OUTDOOR' | 'SECURITY' | 'MONITORING' | 'TRAFFIC'
  protocol: 'RTSP' | 'HTTP' | 'HTTPS'
  resolution: string
  fps: number
  enabled: boolean
  isPublic: boolean
  hasAudio: boolean
  hasPTZ: boolean
  viewerCount?: number
  lastPing?: number
  position?: { lat: number; lng: number }

  username?: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICameraHealth {
  id: string
  cameraId: string
  status: 'ONLINE' | 'OFFLINE' | 'ERROR'
  ping: number
  timestamp: string
  message?: string
}

export interface IMotionEvent {
  id: string
  cameraId: string
  eventType: 'MOTION' | 'PERSON' | 'VEHICLE' | 'INTRUSION'
  confidence: number
  timestamp: string
  thumbnailUrl?: string
  videoUrl?: string
  processed: boolean
}

export interface IStreamSession {
  id: string
  cameraId: string
  userId: string
  startTime: string
  endTime?: string
  duration?: number
  quality: 'SD' | 'HD' | 'FHD' | 'UHD'
  bandwidth: number
}

interface ICartItem {
  id: number
  name: string
  description: string
  image: string
  price: number
  quantity: number
  category?: string
  stock?: number
}

interface IPost {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  featuredImage?: string | null
  publishDate?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'LOW_FPS' | 'ERROR'

export type ICamera = {
  id: string
  name: string
  code: string
  streamUrl: string
  protocol: 'RTSP' | 'HLS' | 'WebRTC'
  zone: string
  type: 'Indoor' | 'Outdoor'
  group?: string
  enabled: boolean
  status: CameraStatus
  lastDowntime?: string
  metrics?: {
    fps?: number
    bitrateKbps?: number
    pingMs?: number
    resolution?: string
  }
  visibility?: { roles?: Role[]; userIds?: string[] }
}

export interface Shelf {
  shelveId: number
  shelveName: string
  operatingHours: number
  shortageHours: number
  shortageRate: number
  alertCount: number
  replenishCount: number
  recoveryRate: number
}

export interface IMetric {
  shelveName: string
  time: string
  osaRate: number
}

// Basic types
export interface IMetric {
  shelveName: string
  time: string // Format: "HH:mm"
  osaRate: number
}

export interface Shelf {
  shelfId: string
  shelfName: string
  status?: string
  lastUpdate?: string
  date?: string
  operatingHours?: number
  shortageHours?: number
  shortageRate?: number
  alertCount?: number
  replenishCount?: number
  recoveryRate?: number
}

// WebSocket message types
export interface WebSocketMetricMessage {
  type: 'metrics'
  data: IMetric[]
}

export interface WebSocketSummaryMessage {
  type: 'summary'
  data: Shelf[]
}
export interface Shelf {
  shelfId: string
  shelfName: string
  status: string
  lastUpdate: string
}

export interface WebSocketMetricMessage {
  type: 'metrics'
  data: IMetric[]
}

export interface WebSocketSummaryMessage {
  type: 'summary'
  data: Shelf[]
}

export interface Shelf {
  shelfId: string
  shelfName: string
  status: string
  lastUpdate: string
}
