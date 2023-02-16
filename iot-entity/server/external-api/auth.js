const axiosApi = require("../helpers/axiosApi");
const authHeader = require("../helpers/authHeader")

const AuthApi = {

  async getUser(userId, token) {
    try {
      return await axiosApi.get(
          `/api/user/${userId}`,
          {headers: authHeader(token)}
      )
    }
    catch (e) {
      console.log('error external-getUser', e.message);
      return false
    }
  },

  async createUser(data, token) {
    try {
      const response = await axiosApi.post(
        '/api/user/',
        data, 
        {headers: authHeader(token)}
      )
      return response.userId
    } 
    catch (e) {
      console.log('error external-createUser', e);
      return false
    }
  },

  async updateUser(userId, data, token) {
    try {
      const response = await axiosApi.put(
        `/api/user/${userId}`,
        data, 
        {headers: authHeader(token)}
      )
      return response.userId
    } 
    catch (e) {
      console.log('error external-createUser', e.message);
      return false
    }
  },

  async deleteUser(userId, token) {
    try {
      return await axiosApi.delete(
          `/api/user/${userId}`,
          {headers: authHeader(token)}
      )
    }
    catch (e) {
      console.log('error external-deleteUser', e.message);
    }
  }
};

module.exports = AuthApi;
