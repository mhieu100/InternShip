function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

type SystemConfig = {
  mediaServer: { type: string; host: string; port: number }
  streaming: { protocols: string[] }
  dns: { domain: string; ssl: boolean }
  health: { intervalSec: number }
}

export const api = {
  getSystemConfig: async () =>
    delay({
      mediaServer: { type: 'MediaMTX', host: 'mtx.example.com', port: 8554 },
      streaming: { protocols: ['WebRTC', 'HLS'] },
      dns: { domain: 'cams.example.com', ssl: true },
      health: { intervalSec: 5 }
    } as SystemConfig),
  updateSystemConfig: async (cfg: SystemConfig) => delay({ ...cfg })
}
