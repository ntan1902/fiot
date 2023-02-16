const {Op} = require("sequelize")
const {DeviceCredentials} = require("../models")

const DeviceCredentialsDAO = {
  async getByCredentialsId(deviceToken, deviceId = null) {
    try {
      const query = {
        where: {
          credentialsId: deviceToken,
        },
      }

      if (deviceId) {
        query.where[deviceId] = {[Op.ne]: deviceId}
      }

      return await DeviceCredentials.findOne(query)
    } catch (e) {
      return false
    }
  },

  async getByDeviceId(deviceId) {
    try {
      return await DeviceCredentials.findOne({
        where: {deviceId},
        raw: true,
      })
    } catch (e) {
      console.log("error", e.message)
      return false
    }
  },

  async getByMqttClientId(value, deviceId) {
    try {
      const valueObj = JSON.parse(value)
      const qs = `{"clientId":"${valueObj.clientId}"`

      return await DeviceCredentials.findOne({
        where: {
          credentialsValue: {[Op.startsWith]: qs},
          deviceId: {[Op.ne]: deviceId},
        },
      })
    } catch (e) {
      console.log("error", e.message)
      return false
    }
  },

  async create(options) {
    try {
      return await DeviceCredentials.create({
        ...options,
      })
    } catch (e) {
      console.log("error", e.message)
      return false
    }
  },

  async update(deviceId, options) {
    try {
      await DeviceCredentials.update({...options}, {where: {deviceId}})
      return true
    } catch (e) {
      console.log("errorhehehhehe", e.message)
      return false
    }
  },
}

module.exports = DeviceCredentialsDAO
