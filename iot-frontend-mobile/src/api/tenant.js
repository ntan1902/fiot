import { API_ENTITY_SERVICE, API_TENANT } from '../config/setting'
import AxiosApi from './axios/axiosApi'

export const TenantApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_TENANT}s`)
  },
  getById: async (id) => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_TENANT}s/${id}`)
  },
  create: (data) => AxiosApi.post(`${API_ENTITY_SERVICE}/${API_TENANT}`, data),
  update: (id, data) =>
    AxiosApi.put(`${API_ENTITY_SERVICE}/${API_TENANT}s/${id}`, data),
  delete: (id) => AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_TENANT}s/${id}`),
}
