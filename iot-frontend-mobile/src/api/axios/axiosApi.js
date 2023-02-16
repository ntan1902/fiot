import axios from 'axios'
import queryString from 'query-string'
import { BASE_URL } from '../../config/setting'
import { getItem } from '../../async-storage'

console.log('BASE_URL', BASE_URL)
const AxiosApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

AxiosApi.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    if (response && response.data) {
      return response.data
    }
  },
  async (error) => {
    throw error
  }
)

AxiosApi.interceptors.request.use(async (config) => {
  const jwt = await getItem('accessToken')
  config.headers = {
    Authorization: `Bearer ${jwt}`,
    Accept: 'application/json',
  }
  return config
})

export default AxiosApi
