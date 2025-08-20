import { IBackendRes, ICamera, IModelPaginate } from 'types/backend'
import axios from './axios-customize'

const CAMERA_API_URL = 'http://localhost:8084/api/cameras'

export const callCreateCamera = (data: ICamera) => {
  return axios.post<IBackendRes<ICamera>>(`${CAMERA_API_URL}`, data)
}

export const callGetCamera = (id: string) => {
  return axios.get<IBackendRes<ICamera>>(`${CAMERA_API_URL}/${id}`)
}

export const callGetCameras = () => {
  return axios.get<IBackendRes<IModelPaginate<ICamera>>>(`${CAMERA_API_URL}`)
}

export const callGetPublicCameras = () => {
  return axios.get<IBackendRes<ICamera[]>>(`${CAMERA_API_URL}/public`)
}

export const callUpdateCamera = (id: string, data: ICamera) => {
  return axios.put<IBackendRes<ICamera>>(`${CAMERA_API_URL}/${id}`, data)
}

export const callDeleteCamera = (id: string) => {
  return axios.delete<IBackendRes<ICamera>>(`${CAMERA_API_URL}/${id}`)
}
