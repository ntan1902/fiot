const {Op} = require("sequelize")
const {Device, DeviceCredentials, CustomerDevice, TenantDevice, Customer, Tenant, DeviceGateway} = require("../models")
const logger = require("../helpers/logger")

const DeviceDAO = {
  async getAll() {
    const deviceQuery = {
      include: [
        {
          model: DeviceCredentials,
          required: true,
          as: "deviceCredentials",
        },
        {
          model: CustomerDevice,
          attributes: ["customerId"],
          as: "deviceCustomers",
        },
        {
          model: TenantDevice,
          attributes: ["tenantId"],
          as: "deviceTenants",
        },
      ],
    }

    return await Device.findAll(deviceQuery, {raw: true})
  },

  async getByFirstTenantId(firstTenantId) {
    const deviceQuery = {
      where: {
        firstTenantId,
        deleted: false,
      },
      include: [
        {
          model: DeviceCredentials,
          required: true,
          as: "deviceCredentials",
        },
        {
          model: CustomerDevice,
          attributes: ["customerId"],
          as: "deviceCustomers",
        },
        {
          model: TenantDevice,
          attributes: ["tenantId"],
          as: "deviceTenants",
        },
      ],
    }

    return await Device.findAll(deviceQuery, {raw: true})
  },

  async getByDeviceIds(deviceIds) {
    const deviceQuery = {
      where: {
        id: deviceIds,
      },
      include: [
        {
          model: DeviceCredentials,
          required: true,
          as: "deviceCredentials",
        },
        {
          model: CustomerDevice,
          attributes: ["customerId"],
          as: "deviceCustomers",
          include: {
            model: Customer,
          },
        },
        {
          model: TenantDevice,
          attributes: ["tenantId"],
          as: "deviceTenants",
          include: {
            model: Tenant,
          },
        },
      ],
    }

    return await Device.findAll(deviceQuery, {raw: true})
  },

  async getByIdWithoutCredentials(deviceId) {
    try {
      return Device.findByPk(deviceId, {raw: true})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getById(deviceId) {
    try {
      return await Device.findByPk(
        deviceId,
        {
          include: {
            model: DeviceCredentials,
            required: true,
            as: "deviceCredentials",
          },
        },
        {raw: true}
      )
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getByName(name) {
    try {
      return await Device.findOne({
        where: {name},
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async create(reqTenant, options) {
    try {
      return await Device.create({
        ...options,
        firstTenantId: reqTenant.firstTenantId,
        tenantId: reqTenant.id,
        createUid: reqTenant.userId,
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async createWithOptions(options) {
    try {
      console.log("create device options", options)
      return await Device.create({...options})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async update(deviceId, options) {
    try {
      return await Device.update({...options}, {where: {id: deviceId}})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async delete(deviceId) {
    try {
      await Device.update({deleted: true}, {where: {id: deviceId}})
      return true
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getByNameExcludeOwnId(deviceName, deviceId) {
    try {
      return await Device.findOne({
        where: {
          name: deviceName,
          id: {[Op.ne]: deviceId},
        },
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getDeviceCustomers(deviceId) {
    try {
      const customers = await CustomerDevice.findAll({
        where: {
          deviceId,
        },
        attributes: ["customerId"],
        include: [
          {
            model: Customer,
            required: true,
          },
        ],
        //raw: true,
      })
      return customers
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getCustomerDevices(customerId) {
    try {
      const assignedDevices = await CustomerDevice.findAll({
        where: {
          customerId,
        },
        attributes: ["deviceId"],
        raw: true,
      })
      return assignedDevices.map((d) => d.deviceId)
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getDeviceTenants(deviceId) {
    try {
      const tenants = await TenantDevice.findAll({
        where: {
          deviceId,
        },
        attributes: ["tenantId"],
        include: [
          {
            model: Tenant,
            required: true,
          },
        ],
        //raw: true,
      })
      return tenants
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getTenantDevices(tenantId) {
    try {
      const assignedDevices = await TenantDevice.findAll({
        where: {
          tenantId,
        },
        attributes: ["deviceId"],
        raw: true,
      })

      const tenantDevices = await Device.findAll({
        where: {
          tenantId,
        },
        attributes: ["id"],
        raw: true,
      })

      const tenantDeviceIds = tenantDevices.map((d) => d.id)
      const assignedDeviceIds = assignedDevices.map((d) => d.deviceId)

      return [...assignedDeviceIds, ...tenantDeviceIds]
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async assignTenantsToDevice(tenantIds, deviceId) {
    try {
      const createRecords = tenantIds.map((t) => {
        return {
          tenantId: t,
          deviceId,
        }
      })
      return await TenantDevice.bulkCreate(createRecords)
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async unassignTenantsFromDevice(tenantIds, deviceId) {
    try {
      return await TenantDevice.destroy({
        where: {
          deviceId,
          tenantId: tenantIds,
        },
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async assignCustomersToDevice(customerIds, deviceId) {
    try {
      const createRecords = customerIds.map((c) => {
        return {
          customerId: c,
          deviceId,
        }
      })
      return await CustomerDevice.bulkCreate(createRecords)
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async unassignCustomersFromDevice(customerIds, deviceId) {
    try {
      return await CustomerDevice.destroy({
        where: {
          deviceId,
          customerId: customerIds,
        },
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getByOptions(options) {
    return Device.findOne({
      where: {...options},
    })
  },

  async updateDeviceGateway(deviceId, gatewayId) {
    try {
      return DeviceGateway.upsert({deviceId, gatewayId})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getGatewayDeviceIds(gatewayId) {
    try {
      const result = await DeviceGateway.findAll({
        where: {
          gatewayId,
        },
      })
      return result.map((dg) => dg.deviceId)
    } catch (e) {
      logger.error(e.message)
      return FontFaceSetLoadEvent
    }
  },
}

module.exports = DeviceDAO
