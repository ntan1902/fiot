const DeviceDAO = require("../dao/device")
const DeviceCredentialsService = require("../services/deviceCredentials")
const constant = require("../helpers/constant")
const logger = require("../helpers/logger")

const db = require("../models/index")
const moment = require("moment/moment")
const RabbitMQProducer = require("../rabbitmq/rabbitProducer")
const {v4: uuidv4} = require("uuid")
const {response} = require("express");

const deviceRpcRequestMap = {}

const handleDeviceAssignation = async (assignedTenantIds, assignedCustomerIds, deviceId) => {
  // Customer Device
  const existingCustomer = await DeviceDAO.getDeviceCustomers(deviceId)
  const existingTenant = await DeviceDAO.getDeviceTenants(deviceId)

  const existingCustomerIds = existingCustomer.map((c) => c.customerId)
  const existingTenantIds = existingTenant.map((t) => t.tenantId)

  if (existingCustomerIds.length === 0) {
    await DeviceDAO.assignCustomersToDevice(assignedCustomerIds, deviceId)
  } else {
    const unassignedCustomerIds = existingCustomerIds.filter((c) => !assignedCustomerIds.includes(c))
    const newAssignedCustomerIds = assignedCustomerIds.filter((c) => !existingCustomerIds.includes(c))
    try {
      await db.sequelize.transaction(async (t) => {
        await DeviceDAO.unassignCustomersFromDevice(unassignedCustomerIds, deviceId)
        await DeviceDAO.assignCustomersToDevice(newAssignedCustomerIds, deviceId)
      })
    } catch (e) {
      logger.error("assign_customer_device_transaction-" + e.message)
    }
  }

  if (existingTenantIds.length === 0) {
    await DeviceDAO.assignTenantsToDevice(assignedTenantIds, deviceId)
  } else {
    const unassignedTenantIds = existingTenantIds.filter((c) => !assignedTenantIds.includes(c))
    const newAssignedTenantIds = assignedTenantIds.filter((c) => !existingTenantIds.includes(c))

    try {
      await db.sequelize.transaction(async (t) => {
        await DeviceDAO.unassignTenantsFromDevice(unassignedTenantIds, deviceId)
        await DeviceDAO.assignTenantsToDevice(newAssignedTenantIds, deviceId)
      })
    } catch (e) {
      logger.error("assign_tenant_transaction-" + e.message)
    }
  }
}

const DeviceService = {
  async getAll(userEntity) {
    const {authorities, id, firstTenantId} = userEntity
    if (authorities.includes(constant.ROLE_ADMIN)) {
      return DeviceDAO.getAll()
    }

    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const deviceIds = await DeviceDAO.getCustomerDevices(id)
      return DeviceDAO.getByDeviceIds(deviceIds)
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      // Is first class tenant
      if (id === firstTenantId) {
        return DeviceDAO.getByFirstTenantId(id)
      }

      const deviceIds = await DeviceDAO.getTenantDevices(id)
      return DeviceDAO.getByDeviceIds(deviceIds)
    }
  },

  async getById(deviceId) {
    return await DeviceDAO.getById(deviceId)
  },

  async getDeviceAndUserIdsById(deviceId) {
    const device  = await DeviceDAO.getByIdWithoutCredentials(deviceId)
    const userIds = await DeviceCredentialsService.getUserIdsRelatedToDevice(device)
    console.log({
      ...device,
      userIds
    })
    return {
      ...device,
      userIds
    }
  },

  async create(reqTenant, options) {
    const {credentialsType, credentialsValue, assignedTenants, assignedCustomers, ...deviceOptions} = options

    try {
      const createDevice = await DeviceDAO.create(reqTenant, {
        ...deviceOptions,
        lastActiveTime: Date.now(),
      })

      const deviceCredentialsInfo = {
        deviceId: createDevice.id,
        credentialsType,
        credentialsValue,
        createUid: reqTenant.userId,
      }
      await DeviceCredentialsService.create(deviceCredentialsInfo)

      await DeviceDAO.assignTenantsToDevice(assignedTenants, createDevice.id)

      await DeviceDAO.assignCustomersToDevice(assignedCustomers, createDevice.id)

      return this.getById(createDevice.id)
    } catch (e) {
      console.log("Error occurred while create device", e)
      return null
    }
  },

  async update(deviceId, userId, options) {
    const deviceInfo = {
      ...options,
      updateUid: userId,
    }
    const {assignedTenants, assignedCustomers} = options

    await DeviceDAO.update(deviceId, deviceInfo)

    await handleDeviceAssignation(assignedTenants, assignedCustomers, deviceId)

    return this.getById(deviceId)
  },

  updateLastActiveTime(deviceId) {
    console.log(moment())
    const deviceInfo = {
      isLive: true,
      lastActiveTime: Date.now(),
    }

    try {
      DeviceDAO.update(deviceId, deviceInfo)
    } catch (e) {
      console.log("Error occurred", e)
    }
  },

  async delete(deviceId) {
    return await DeviceDAO.delete(deviceId)
  },

  async getOrCreateDevice(name, tenantId, firstTenantId, label, gatewayId) {
    const existDevice = await DeviceDAO.getByOptions({name, tenantId})
    if (!existDevice) {
      const newDevice = await DeviceDAO.createWithOptions({
        name,
        tenantId,
        firstTenantId,
        label,
        isLive: true,
        lastActiveTime: Date.now()
      })

      await DeviceCredentialsService.create({deviceId: newDevice.id})

      await DeviceDAO.updateDeviceGateway(newDevice.id, gatewayId)
      const device = await DeviceDAO.getByIdWithoutCredentials(newDevice.id)
      const userIds = await DeviceCredentialsService.getUserIdsRelatedToDevice(device)
      return {
        ...device,
        userIds,
      }
    }

    const device = await DeviceDAO.getByIdWithoutCredentials(existDevice.id)
    await DeviceDAO.updateDeviceGateway(existDevice.id, gatewayId)

    const userIds = await DeviceCredentialsService.getUserIdsRelatedToDevice(device)
    return {
      ...device,
      userIds,
    }
  },

  async handleDeviceRPCRequest(deviceId, tenantId, method, params) {
    try {
      const existDevice = await DeviceDAO.getByOptions({id: deviceId, tenantId})

      if (existDevice) {
        const queueMsg = await this.getQueueMsg(method, params, existDevice.dataValues)
        return this.processRestApiRpcRequest(queueMsg)
            .then((deviceRpcResponse) => {
              if (!deviceRpcResponse.error) {
                return deviceRpcResponse.response
              }
            })
      }
    } catch (e) {
      console.log("Error occurred", e)
      return null
    }
  },

  async updateDeviceAttributes(attributes, deviceId) {
    try {
      await DeviceDAO.update(deviceId, {attributes})
      return this.getById(deviceId)
    } catch (e) {
      console.log("Error occurred", e)
      return null
    }
  },

  async getGatewayDevices(gatewayId) {
    try {
      const gatewayDeviceIds = await DeviceDAO.getGatewayDeviceIds(gatewayId)
      return DeviceDAO.getByDeviceIds(gatewayDeviceIds)
    } catch (e) {
      console.log("Error occurred", e)
      return null
    }
  }, 

  async getQueueMsg(method, params, device) {
    const userIds = await DeviceCredentialsService.getUserIdsRelatedToDevice(device)
    const key = uuidv4()
    const data = {
      method: method,
      params: this.hasJsonStructure(params) ? JSON.stringify(params) : params,
      deviceId: device.id,
    }
    const metaData = {
      deviceName: device.name,
      deviceLabel: device.label,
      deviceType: device.type,
    }

    return {
      key,
      entityId: device.id,
      data: JSON.stringify(data),
      metaData,
      ruleChainId: device.ruleChainId,
      type: "RPC_REQUEST_TO_DEVICE",
      userIds,
    }
  },

  hasJsonStructure(str) {
    if (typeof str !== "string") {
      return false
    }

    try {
      const result = JSON.parse(str)
      const type = Object.prototype.toString.call(result)
      return type === "[object Object]" || type === "[object Array]"
    } catch (err) {
      return false
    }
  },

  processRestApiRpcRequest(queueMsg) {
    return new Promise((resolve, reject) => {
      deviceRpcRequestMap[queueMsg.key] = resolve;

      RabbitMQProducer.sendMessage(queueMsg);

      setTimeout((key) => {
        const resolveByKey = deviceRpcRequestMap[key];
        delete deviceRpcRequestMap[key];

        if (resolveByKey) {
          resolveByKey({
            key: key,
            response: null,
            error: "timeout"
          })
        }
      }, 60000, queueMsg.key)
    })

  },

  receiveRpcResponseFromDevice(deviceRpcResponse) {
    const resolveByKey = deviceRpcRequestMap[deviceRpcResponse.key];
    delete deviceRpcRequestMap[deviceRpcResponse.key];

    if (resolveByKey) {
      resolveByKey({
        key: deviceRpcResponse.key,
        response: deviceRpcResponse.response,
        error: null
      })
    }
  }

}

module.exports = DeviceService
