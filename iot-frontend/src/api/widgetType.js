import {API_ENTITY_SERVICE, API_WIDGET_TYPE} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const WidgetTypeApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_WIDGET_TYPE}s`)
  },
  getById: async (id) => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_WIDGET_TYPE}s/${id}`)
  },
  create: (data) => AxiosApi.post(`${API_ENTITY_SERVICE}/${API_WIDGET_TYPE}`, data),
  update: (id, data) => AxiosApi.put(`${API_ENTITY_SERVICE}/${API_WIDGET_TYPE}s/${id}`, data),
  delete: (id) => AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_WIDGET_TYPE}s/${id}`)
}