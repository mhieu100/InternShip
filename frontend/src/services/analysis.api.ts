import {
  IBackendRes,
  IShortageByEachShelf,
  IShortageRateTotal
} from 'types/backend'
import axios from './axios-customize'

const ANALYSIS_API_URL = 'http://localhost:8083/api/analysis'

export const callData = (
  startDate: string,
  endDate: string,
  includeShelf: string
) => {
  return axios.post<IBackendRes<IShortageRateTotal[]>>(
    `${ANALYSIS_API_URL}/data-chart_1`,
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
    `${ANALYSIS_API_URL}/data-chart_2`,
    {
      startDate,
      endDate,
      includeShelf
    }
  )
}
