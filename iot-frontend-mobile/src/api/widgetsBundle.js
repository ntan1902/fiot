import { API_ENTITY_SERVICE, API_WIDGETS_BUNDLE } from '../config/setting'
import AxiosApi from './axios/axiosApi'

export const WidgetsBundleApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_WIDGETS_BUNDLE}s`)
  },
  getById: async (id) => {
    return await AxiosApi.get(
      `${API_ENTITY_SERVICE}/${API_WIDGETS_BUNDLE}s/${id}`
    )
  },
  create: (data) =>
    AxiosApi.post(`${API_ENTITY_SERVICE}/${API_WIDGETS_BUNDLE}`, data),
  update: (id, data) =>
    AxiosApi.put(`${API_ENTITY_SERVICE}/${API_WIDGETS_BUNDLE}s/${id}`, data),
  delete: (id) =>
    AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_WIDGETS_BUNDLE}s/${id}`),
}
