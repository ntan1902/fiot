import {API_DASHBOARD, API_ENTITY_SERVICE} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const DashboardApi = {
  getAll: async () => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DASHBOARD}s`);
  },
  getById: async (id) => {
    return await AxiosApi.get(`${API_ENTITY_SERVICE}/${API_DASHBOARD}s/${id}`);
  },
  create: async (data) => AxiosApi.post(`${API_ENTITY_SERVICE}/${API_DASHBOARD}`, data),
  update: async (id, data) =>
      AxiosApi.put(`${API_ENTITY_SERVICE}/${API_DASHBOARD}s/${id}`, data),
  updateConfiguration: async (id, data) =>
      AxiosApi.put(`${API_ENTITY_SERVICE}/${API_DASHBOARD}s/${id}/configuration`, data),
  delete: async (id) => AxiosApi.delete(`${API_ENTITY_SERVICE}/${API_DASHBOARD}s/${id}`),
};
