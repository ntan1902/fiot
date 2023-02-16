const axios = require('axios')
const queryString = require('query-string')
const constants = require('../helpers/constant')

const AxiosApi = axios.create({
  baseURL: constants.IOT_AUTH_URL,
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

module.exports = AxiosApi;
