export interface IApiResponse<T> {
  error?: string | string[] | null
  message: string
  statusCode: number | string
  data?: T
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

export interface IGetAccount extends Omit<IAccount, 'access_token'> {}

export interface IUser {
  id?: string
  name: string
  email: string
  password?: string
  address: string
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
