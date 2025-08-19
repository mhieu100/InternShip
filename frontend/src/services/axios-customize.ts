import { message } from 'antd'
import { Mutex } from 'async-mutex'
import axiosClient from 'axios'
import { IApiResponse } from 'types/backend'
interface AccessTokenResponse {
  access_token: string
}

const instance = axiosClient.create({
  withCredentials: true
})

const mutex = new Mutex()
const NO_RETRY_HEADER = 'x-no-retry'

const handleRefreshToken = async (): Promise<any | null> => {
  return await mutex.runExclusive(async () => {
    try {
      const response = await axiosClient.get<IApiResponse<AccessTokenResponse>>(
        'http://localhost:8081/api/auth/refresh',
        {
          withCredentials: true
        }
      )
      if (response?.data) return response.data
      return null
    } catch (error) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  })
}

instance.interceptors.request.use(function (config) {
  if (
    typeof window !== 'undefined' &&
    window &&
    window.localStorage &&
    window.localStorage.getItem('access_token')
  ) {
    config.headers.Authorization =
      'Bearer ' + window.localStorage.getItem('access_token')
  }
  if (!config.headers.Accept && config.headers['Content-Type']) {
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
  }
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      error.config.url !== '/api/auth/login' &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const response = await handleRefreshToken()
      error.config.headers[NO_RETRY_HEADER] = 'true'

      error.config.headers['Authorization'] =
        `Bearer ${response.data.access_token}`
      localStorage.setItem('access_token', response.data.access_token)
      return instance.request(error.config)
    }

    return error?.response?.data ?? Promise.reject(error)
  }
)

export default instance
