import { API_CUSTOMER, API_ENTITY_SERVICE } from '../config/setting'
import AxiosApi from './axios/axiosApi'

export const CustomerApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_CUSTOMER}s`)
  },
  getById: async (id) => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_CUSTOMER}s/${id}`)
  },
  create: (data) =>
    AxiosApi.post(`${API_ENTITY_SERVICE}/${API_CUSTOMER}`, data),
  update: (id, data) =>
    AxiosApi.put(`${API_ENTITY_SERVICE}/${API_CUSTOMER}s/${id}`, data),
  delete: (id) =>
    AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_CUSTOMER}s/${id}`),
}
