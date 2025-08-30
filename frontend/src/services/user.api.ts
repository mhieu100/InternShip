import { IBackendRes, IModelPaginate, IUser } from 'types/backend'
import axios from './axios-customize'

export const callCreateUser = (data: IUser) => {
  return axios.post<IBackendRes<IUser>>(`/api/users`, data)
}

export const callGetUser = (id: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/users/${id}`)
}

export const callGetUsers = () => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/users`)
}

export const callUpdateUser = (id: string, data: IUser) => {
  return axios.put<IBackendRes<IUser>>(`/api/users/${id}`, data)
}

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/users/${id}`)
}
