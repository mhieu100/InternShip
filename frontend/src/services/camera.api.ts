import { IApiResponse, ICamera } from 'types/backend'
import axios from './axios-customize'

const CAMERA_API_URL = 'http://localhost:8084/api/cameras'

export const callCreateCamera = (data: ICamera) => {
  return axios.post<IApiResponse<ICamera>>(`${CAMERA_API_URL}`, data)
}

export const callGetCamera = (id: string) => {
  return axios.get<IApiResponse<ICamera>>(`${CAMERA_API_URL}/${id}`)
}

export const callGetCameras = () => {
  return axios.get<IApiResponse<ICamera[]>>(`${CAMERA_API_URL}`)
}

export const callUpdateCamera = (id: string, data: ICamera) => {
  return axios.put<IApiResponse<ICamera>>(`${CAMERA_API_URL}/${id}`, data)
}

export const callDeleteCamera = (id: string) => {
  return axios.delete<IApiResponse<ICamera>>(`${CAMERA_API_URL}/${id}`)
}
