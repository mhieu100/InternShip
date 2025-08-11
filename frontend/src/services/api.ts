function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const api = {
  getSystemConfig: async () =>
    delay({
      mediaServer: { type: 'MediaMTX', host: 'mtx.example.com', port: 8554 },
      streaming: { protocols: ['WebRTC', 'HLS'] },
      dns: { domain: 'cams.example.com', ssl: true },
      health: { intervalSec: 5 }
    }),
  updateSystemConfig: async (cfg: any) => delay({ ...cfg })
}
