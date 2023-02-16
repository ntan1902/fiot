import {API_DEVICE, API_ENTITY_SERVICE} from "../config/setting"
import AxiosApi from "./axios/axiosApi"

export const DeviceApi = {
  getAll: async () => {
    return AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DEVICE}s`)
  },
  getById: async (id) => {
    return AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DEVICE}s/${id}`)
  },
  create: async (data) => {
    return AxiosApi.post(`${API_ENTITY_SERVICE}/${API_DEVICE}`, data)
  },
  update: async (id, data) => {
    return AxiosApi.put(`${API_ENTITY_SERVICE}/${API_DEVICE}s/${id}`, data)
  },
  delete: (id) => AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_DEVICE}s/${id}`),

  getCredentialsById: async (id) => {
    return AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DEVICE}s/credentials/${id}`)
  },

  updateCredentials: async (id, data) => {
    return AxiosApi.put(`${API_ENTITY_SERVICE}/${API_DEVICE}s/credentials/${id}`, data)
  },

  updateAttributes: async (id, data) => {
    return AxiosApi.put(`${API_ENTITY_SERVICE}/${API_DEVICE}s/attributes/${id}`, data)
  },

  rpcRequest: async (id, data) => {
    return AxiosApi.post(`${API_ENTITY_SERVICE}/${API_DEVICE}s/rpc/request/${id}`, data)
  },

  getGatewayDevices: async (id) => {
    return AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DEVICE}s/gateway-${API_DEVICE}s/${id}`)
  }
}
