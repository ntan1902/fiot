import { API_TELEMETRY, API_TRANSPORT_SERVICE } from '../config/setting'
import AxiosApi from './axios/axiosApi'

export const TransportApi = {
  postTelemetry: (body) => {
    return AxiosApi.post(`${API_TRANSPORT_SERVICE}/${API_TELEMETRY}`, body)
  },
}
