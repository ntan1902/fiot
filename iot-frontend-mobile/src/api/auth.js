import { API_AUTH_SERVICE, BASE_URL } from '../config/setting'
import AxiosApi from './axios/axiosApi'

export const AuthApi = {
  register: async (data) => {
    // eslint-disable-next-line no-return-await
    return await AxiosApi.post(`${API_AUTH_SERVICE}/register`, data)
  },
  login: async (data) => {
    // eslint-disable-next-line no-return-await
    return await AxiosApi.post(`${API_AUTH_SERVICE}/login`, data)
  },
  changePassword: async (data) => {
    // eslint-disable-next-line no-return-await
    return await AxiosApi.post(`${API_AUTH_SERVICE}/change-password`, data)
  },
  activateUser: async (data) => {
    // eslint-disable-next-line no-return-await
    return await AxiosApi.post(`${API_AUTH_SERVICE}/activate-user`, data)
  },
}
