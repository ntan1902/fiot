import axios from "axios";
import queryString from "query-string";
import {BASE_URL} from "../../config/setting";
import {getItem} from "../../local-storage";

const AxiosApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

AxiosApi.interceptors.response.use(response => {
  if (response && response.data) {
    return response.data;
  }
}, async error => {

  throw error;
});

AxiosApi.interceptors.request.use(config => {
  const jwt = getItem("accessToken");
  config.headers = {
    Authorization: `Bearer ${jwt}`,
    Accept: 'application/json'
  }
  return config;
})


export default AxiosApi;