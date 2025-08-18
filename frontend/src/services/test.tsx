import { IApiResponse, IMetric } from 'types/backend'
import axios from './axios-customize'
const TEST_API_URL = 'http://localhost:8083/api/analysis'

export const callDemoData = () => {
  return axios.get<IApiResponse<IMetric[]>>(`${TEST_API_URL}/demo`)
}
