/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mutex } from 'async-mutex'
import axiosClient from 'axios'
import { setLogout } from 'redux/slices/authSlice'
import store from 'redux/store'
import { IBackendRes } from 'types/backend'
interface AccessTokenResponse {
  access_token: string
}

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const instance = axiosClient.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
})

const mutex = new Mutex()
const NO_RETRY_HEADER = 'x-no-retry'

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    const response =
      await instance.get<IBackendRes<AccessTokenResponse>>('/api/auth/refresh')
    if (response && response.data) return response.data.access_token
    else {
      store.dispatch(setLogout())
      return null
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

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
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
      const access_token = await handleRefreshToken()
      error.config.headers[NO_RETRY_HEADER] = 'true'
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`
        localStorage.setItem('access_token', access_token)
        return instance.request(error.config)
      }
    }

    return error?.response?.data ?? Promise.reject(error)
  }
)

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;

export default instance
