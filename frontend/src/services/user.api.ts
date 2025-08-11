import { IApiResponse, IUser } from 'types/backend'
import axios from './axios-customize'

const USER_API_URL = 'http://localhost:8081/api/users'

export const callCreateUser = (data: IUser) => {
  return axios.post<IApiResponse<IUser>>(`${USER_API_URL}`, data)
}

export const callGetUser = (id: string) => {
  return axios.get<IApiResponse<IUser>>(`${USER_API_URL}/${id}`)
}

export const callGetUsers = () => {
  return axios.get<IApiResponse<IUser[]>>(`${USER_API_URL}`)
}

export const callUpdateUser = (id: string, data: IUser) => {
  return axios.put<IApiResponse<IUser>>(`${USER_API_URL}/${id}`, data)
}

export const callDeleteUser = (id: string) => {
  return axios.delete<IApiResponse<IUser>>(`${USER_API_URL}/${id}`)
}
