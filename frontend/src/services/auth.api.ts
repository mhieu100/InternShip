import { IAccount, IBackendRes, IGetAccount, IUser } from 'types/backend'
import axios from './axios-customize'

export const callRegister = (name: string, email: string, password: string) => {
  return axios.post<IBackendRes<IUser>>(`/api/auth/register`, {
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
  return axios.post<IBackendRes<IUser>>(`/api/auth/verify`, {
    code,
    email,
    name,
    password
  })
}

export const callResendCode = (email: string) => {
  return axios.post<IBackendRes<IUser>>(`/api/auth/resend-code`, {
    email: email
  })
}

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>(`/api/auth/login`, {
    username,
    password
  })
}

export const callLoginGoogle = (token: string) => {
  return axios.post<IBackendRes<IAccount>>(`/api/auth/google`, {
    token
  })
}

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>(`/api/auth/refresh`)
}

export const callLogout = () => {
  return axios.post<IBackendRes<string>>(`/api/auth/logout`)
}

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>(`/api/auth/account`)
}
