import { IBackendRes, ICamera, IModelPaginate } from 'types/backend'
import axios from './axios-customize'

export const callCreateCamera = (data: ICamera) => {
  return axios.post<IBackendRes<ICamera>>(`/api/cameras`, data)
}

export const callGetCamera = (id: string) => {
  return axios.get<IBackendRes<ICamera>>(`/api/cameras/${id}`)
}

export const callGetCameras = () => {
  return axios.get<IBackendRes<IModelPaginate<ICamera>>>(`/api/cameras`)
}

export const callGetPublicCameras = () => {
  return axios.get<IBackendRes<IModelPaginate<ICamera>>>(`/api/cameras/public`)
}

export const callUpdateCamera = (id: string, data: ICamera) => {
  return axios.put<IBackendRes<ICamera>>(`/api/cameras/${id}`, data)
}

export const callDeleteCamera = (id: string) => {
  return axios.delete<IBackendRes<ICamera>>(`/api/cameras/${id}`)
}
