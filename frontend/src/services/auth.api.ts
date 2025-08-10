import { IAccount, IApiResponse, IGetAccount, IUser } from 'types/backend'
import axios from './axios-customize'

const AUTH_API_URL = 'http://localhost:8081/api/auth'

export const callRegister = (name: string, email: string, password: string) => {
  return axios.post<IApiResponse<IUser>>(`${AUTH_API_URL}/register`, {
    name,
    email,
    password
  })
}

export const callLogin = (username: string, password: string) => {
  return axios.post<IApiResponse<IAccount>>(`${AUTH_API_URL}/login`, {
    username,
    password
  })
}
export const callRefreshToken = () => {
  return axios.get<IApiResponse<IAccount>>(`${AUTH_API_URL}/refresh`)
}

export const callLogout = () => {
  return axios.post<IApiResponse<string>>(`${AUTH_API_URL}/logout`)
}

export const callFetchAccount = () => {
  return axios.get<IApiResponse<IGetAccount>>(`${AUTH_API_URL}/account`)
}
