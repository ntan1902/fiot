import {API_AUTH_SERVICE} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const AuthApi = {
  register: async (data) => {
    return await AxiosApi.post(`${API_AUTH_SERVICE}/register`, data);
  },
  login: async (data) => {
    return await AxiosApi.post(`${API_AUTH_SERVICE}/login`, data);
  },
  changePassword: async (data) => {
    return await AxiosApi.post(`${API_AUTH_SERVICE}/change-password`, data);
  },
  activateUser: async (data) => {
    return await AxiosApi.post(`${API_AUTH_SERVICE}/activate-user`, data);
  },
  getAllUsers: async (userId) => {
    return await AxiosApi.get(`${API_AUTH_SERVICE}/users/${userId}`)
  }
};
