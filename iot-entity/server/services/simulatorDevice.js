const SimulatorDeviceDAO = require("../dao/simulatorDevice")
const constant = require("../helpers/constant")

const moment = require("moment/moment")

const SimulatorDeviceService = {
  async getAll(userEntity) {
    const {authorities, id} = userEntity
    if (authorities.includes(constant.ROLE_ADMIN)) {
      return SimulatorDeviceDAO.getAll()
    }

    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      return false
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      return SimulatorDeviceDAO.getByTenantId(id)
    }
  },

  async getById(simulatorDeviceId) {
    return SimulatorDeviceDAO.getById(simulatorDeviceId)
  },

  async create(reqTenant, options) {
    try {
      const createDevice = await SimulatorDeviceDAO.create(reqTenant, options)
      return this.getById(createDevice.id)
    } catch (e) {
      console.log("Error occurred while create simulator device", e)
      return null
    }
  },

  async update(simulatorDeviceId, userId, options) {
    const deviceInfo = {
      ...options,
      updateUid: userId,
    }

    await SimulatorDeviceDAO.update(simulatorDeviceId, deviceInfo)
    return this.getById(simulatorDeviceId)
  },

  async delete(simulatorDeviceId) {
    return SimulatorDeviceDAO.delete(simulatorDeviceId)
  },
}

module.exports = SimulatorDeviceService
