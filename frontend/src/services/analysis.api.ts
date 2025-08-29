import {
  IBackendRes,
  IModelPaginate,
  IRecoveryByEachShelf,
  IRecoveryRateTotal,
  IShelf,
  IShortageByEachShelf,
  IShortageRateTotal
} from 'types/backend'
import axios from './axios-customize'

export const callGetShelves = () => {
  return axios.get<IBackendRes<IModelPaginate<IShelf>>>(`/api/analysis/shelves`)
}

export const callAverageShortageRate = (
  startDate: string,
  endDate: string,
  includeShelf: string[]
) => {
  return axios.post<IBackendRes<IShortageRateTotal[]>>(
    `/api/analysis/average-shortage-rate`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}

export const callAverageRecoveryRate = (
  startDate: string,
  endDate: string,
  includeShelf: string[]
) => {
  return axios.post<IBackendRes<IRecoveryRateTotal[]>>(
    `/api/analysis/average-recovery-rate`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}

export const callShortageStatusByEach = (
  startDate: string,
  endDate: string,
  includeShelf: string[]
) => {
  return axios.post<IBackendRes<IShortageByEachShelf[]>>(
    `/api/analysis/shortage-status-by-each`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}

export const callRecoveryStatusByEach = (
  startDate: string,
  endDate: string,
  includeShelf: string[]
) => {
  return axios.post<IBackendRes<IRecoveryByEachShelf[]>>(
    `/api/analysis/recovery-status-by-each`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}
