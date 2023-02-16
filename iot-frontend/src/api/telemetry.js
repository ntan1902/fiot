import {API_DEVICE, API_TELEMETRY, API_TELEMETRY_SERVICE} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const TelemetryApi = {
  getByDeviceId: async (deviceId) => {
    return await AxiosApi.get(`${API_TELEMETRY_SERVICE}/${API_DEVICE}/${deviceId}/${API_TELEMETRY}`)
  },

  getLatestByDeviceId: async(deviceId) => {
    return await AxiosApi.get(`${API_TELEMETRY_SERVICE}/${API_DEVICE}/${deviceId}/latest-${API_TELEMETRY}`)
  }
}