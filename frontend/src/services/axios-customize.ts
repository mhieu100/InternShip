import { notification } from 'antd'
import { Mutex } from 'async-mutex'
import axiosClient from 'axios'
import { setRefreshTokenAction } from 'redux/slices/authSlice'
import store from 'redux/store'
import { IApiResponse } from 'types/backend'
interface AccessTokenResponse {
  access_token: string
}

const instance = axiosClient.create({
  withCredentials: true
})

const mutex = new Mutex()
const NO_RETRY_HEADER = 'x-no-retry'

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    const response = await axiosClient.get<IApiResponse<AccessTokenResponse>>(
      'http://localhost:8081/api/auth/refresh'
    )
    if (response && response.data) return response.data.access_token
    else return null
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
    // if (
    //   error.config &&
    //   error.response &&
    //   +error.response.status === 401 &&
    //   error.config.url !== '/api/auth/login' &&
    //   !error.config.headers[NO_RETRY_HEADER]
    // ) {
    //   const access_token = await handleRefreshToken()
    //   error.config.headers[NO_RETRY_HEADER] = 'true'
    //   if (access_token) {
    //     error.config.headers['Authorization'] = `Bearer ${access_token}`
    //     localStorage.setItem('access_token', access_token)
    //     return instance.request(error.config)
    //   }
    // }

    //   if (
    //     error.config &&
    //     error.response &&
    //     +error.response.status === 400 &&
    //     error.config.url === '/api/v1/auth/refresh' &&
    //     location.pathname.startsWith('/admin')
    //   ) {
    //     const message =
    //       error?.response?.data?.error ?? 'Có lỗi xảy ra, vui lòng login.'
    //     store.dispatch(setRefreshTokenAction({ status: true, message }))
    //   }

    //   if (+error.response.status === 403) {
    //     notification.error({
    //       message: error?.response?.data?.message ?? '',
    //       description: error?.response?.data?.error ?? ''
    //     })
    //   }

    return error?.response?.data ?? Promise.reject(error)
  }
)

export default instance
