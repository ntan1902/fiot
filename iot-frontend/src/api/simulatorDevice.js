import {API_SIMULATOR_DEVICE, API_ENTITY_SERVICE} from "../config/setting"
import AxiosApi from "./axios/axiosApi"

export const SimulatorDeviceApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_SIMULATOR_DEVICE}s`)
  },
  getById: async (id) => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_SIMULATOR_DEVICE}s/${id}`)
  },
  create: async (data) => {
    return await AxiosApi.post(`${API_ENTITY_SERVICE}/${API_SIMULATOR_DEVICE}`, data)
  },
  update: async (id, data) => {
    return await AxiosApi.put(`${API_ENTITY_SERVICE}/${API_SIMULATOR_DEVICE}s/${id}`, data)
  },
  delete: (id) => AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_SIMULATOR_DEVICE}s/${id}`),
}
