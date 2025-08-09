// Simple mock API using in-memory data for development/demo

import { ICamera } from "types/backend"

export const GROUPS = ['Camera văn phòng', 'Camera kho bãi'] as const

let cameras: ICamera[] = [
  { id: 'c1', name: 'Cam Văn phòng 1', code: 'OFFICE-01', streamUrl: 'rtsp://example/office1', protocol: 'RTSP', zone: 'Văn phòng', type: 'Indoor', group: 'Camera văn phòng', enabled: true, status: 'ONLINE', metrics: { fps: 25, bitrateKbps: 1500, pingMs: 12, resolution: '1920x1080' } },
  { id: 'c2', name: 'Cam Kho 1', code: 'WARE-01', streamUrl: 'rtsp://example/warehouse1', protocol: 'RTSP', zone: 'Kho', type: 'Outdoor', group: 'Camera kho bãi', enabled: true, status: 'LOW_FPS', metrics: { fps: 8, bitrateKbps: 600, pingMs: 30, resolution: '1280x720' }, lastDowntime: new Date().toISOString() },
  { id: 'c3', name: 'Cam Cổng', code: 'GATE-01', streamUrl: 'hls://example/gate1', protocol: 'HLS', zone: 'Cổng', type: 'Outdoor', group: 'Camera kho bãi', enabled: false, status: 'OFFLINE', lastDowntime: new Date().toISOString() },
]

// let users: (User & { role: Role })[] = [
//   { id: 'u1', name: 'Alice Admin', email: 'alice@example.com', role: 'Admin', twoFAEnabled: true },
//   { id: 'u2', name: 'Mark Manager', email: 'mark@example.com', role: 'Manager', groups: ['Kho'], twoFAEnabled: false },
//   { id: 'u3', name: 'Viet Viewer', email: 'viet@example.com', role: 'Viewer' },
// ]

// let alertRules: AlertRule[] = [
//   { id: 'r1', name: 'Cảnh báo mất kết nối', channels: { email: true, websocket: true }, when: { offline: true, lowFps: false } },
// ]

// let alertEvents: AlertEvent[] = []

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const api = {
  // Cameras
  listCameras: async () => delay([...cameras]),
  createCamera: async (payload: Omit<ICamera, 'id'>) => {
    const cam: ICamera = { ...payload, id: `c${Date.now()}`, status: payload.status || 'ONLINE' }
    cameras.unshift(cam)
    return delay(cam)
  },
  updateCamera: async (id: string, payload: Partial<ICamera>) => {
    cameras = cameras.map((c) => (c.id === id ? { ...c, ...payload } : c))
    return delay(cameras.find((c) => c.id === id)!)
  },
  deleteCamera: async (id: string) => {
    cameras = cameras.filter((c) => c.id !== id)
    return delay({ ok: true })
  },
  // Health
  getHealthStats: async () => {
    const online = cameras.filter((c) => c.status === 'ONLINE').length
    const offline = cameras.filter((c) => c.status === 'OFFLINE').length
    const lowFps = cameras.filter((c) => c.status === 'LOW_FPS').length
    return delay({ online, offline, lowFps, total: cameras.length })
  },
  reloadStream: async (id: string) => delay({ id, reloaded: true }),

  // Users
  // listUsers: async () => delay([...users]),
  // createUser: async (payload: Omit<User, 'id'> & { role: Role }) => {
  //   const u = { ...payload, id: `u${Date.now()}` }
  //   users.unshift(u)
  //   return delay(u)
  // },
  // updateUser: async (id: string, payload: Partial<User & { role: Role }>) => {
  //   users = users.map((u) => (u.id === id ? { ...u, ...payload } : u))
  //   return delay(users.find((u) => u.id === id)!)
  // },
  // deleteUser: async (id: string) => {
  //   users = users.filter((u) => u.id !== id)
  //   return delay({ ok: true })
  // },

  // Alert rules/events
  // listAlertRules: async () => delay([...alertRules]),
  // upsertAlertRule: async (payload: AlertRule) => {
  //   const idx = alertRules.findIndex((r) => r.id === payload.id)
  //   if (idx >= 0) alertRules[idx] = payload
  //   else alertRules.push({ ...payload, id: `r${Date.now()}` })
  //   return delay(payload)
  // },
  // listAlertEvents: async () => delay([...alertEvents]),
  // addAlertEvent: async (payload: AlertEvent) => { alertEvents.unshift(payload); return delay(payload) },

  // System config (in-memory)
  getSystemConfig: async () => delay({
    mediaServer: { type: 'MediaMTX', host: 'mtx.example.com', port: 8554 },
    streaming: { protocols: ['WebRTC', 'HLS'] },
    dns: { domain: 'cams.example.com', ssl: true },
    health: { intervalSec: 5 },
  }),
  updateSystemConfig: async (cfg: any) => delay({ ...cfg }),
}
