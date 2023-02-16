const {Op} = require("sequelize")
const {SimulatorDevice} = require("../models")
const logger = require("../helpers/logger")

const DeviceDAO = {
  async getAll() {
    return SimulatorDevice.findAll(
      {
        where: {
          deleted: false,
        },
      },
      {raw: true}
    )
  },

  async getByTenantId(tenantId) {
    return SimulatorDevice.findAll(
      {
        where: {
          tenantId,
          deleted: false,
        },
      },
      {raw: true}
    )
  },

  async getById(simulatorDeviceId) {
    try {
      return SimulatorDevice.findByPk(simulatorDeviceId, {raw: true})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async create(reqTenant, options) {
    try {
      return SimulatorDevice.create({
        ...options,
        tenantId: reqTenant.id,
        createUid: reqTenant.userId,
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async update(simulatorDeviceId, options) {
    try {
      return SimulatorDevice.update({...options}, {where: {id: simulatorDeviceId}})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async delete(simulatorDeviceId) {
    try {
      await SimulatorDevice.update({deleted: true}, {where: {id: simulatorDeviceId}})
      return true
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },
}

module.exports = DeviceDAO
