import {
  IBackendRes,
  IShortageByEachShelf,
  IShortageRateTotal
} from 'types/backend'
import axios from './axios-customize'

export const callData = (
  startDate: string,
  endDate: string,
  includeShelf: string
) => {
  return axios.post<IBackendRes<IShortageRateTotal[]>>(
    `/api/analysis/data-chart_1`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}

export const callData_1 = (
  startDate: string,
  endDate: string,
  includeShelf: string
) => {
  return axios.post<IBackendRes<IShortageByEachShelf[]>>(
    `/api/analysis/data-chart_2`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}
