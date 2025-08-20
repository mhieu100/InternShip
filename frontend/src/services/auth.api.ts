import { IAccount, IBackendRes, IGetAccount, IUser } from 'types/backend'
import axios from './axios-customize'

const AUTH_API_URL = 'http://localhost:8081/api/auth'

export const callRegister = (name: string, email: string, password: string) => {
  return axios.post<IBackendRes<IUser>>(`${AUTH_API_URL}/register`, {
    name,
    email,
    password
  })
}

export const callVerifyCode = (
  code: number,
  email: string,
  name: string,
  password: string
) => {
  return axios.post<IBackendRes<IUser>>(`${AUTH_API_URL}/verify`, {
    code,
    email,
    name,
    password
  })
}

export const callResendCode = (email: string) => {
  return axios.post<IBackendRes<IUser>>(`${AUTH_API_URL}/resend-code`, {
    email: email
  })
}

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>(`${AUTH_API_URL}/login`, {
    username,
    password
  })
}

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>(`${AUTH_API_URL}/refresh`)
}

export const callLogout = () => {
  return axios.post<IBackendRes<string>>(`${AUTH_API_URL}/logout`)
}

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>(`${AUTH_API_URL}/account`)
}
