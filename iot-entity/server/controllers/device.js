const DeviceService = require("../services/device")
const EntityService = require("../services/entity")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")

module.exports = {
  async getDevices(req, res) {
    const {userId, authorities, isAdmin} = req
    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity && !isAdmin) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await DeviceService.getAll({...userEntity, authorities})
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get devices!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getDevice(req, res) {
    const {deviceId} = req.query
    const result = await DeviceService.getById(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get device with UUID: ${deviceId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getDeviceAndUserIds(req, res) {
    const {deviceId} = req.query
    const result = await DeviceService.getDeviceAndUserIdsById(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get device with UUID: ${deviceId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },


  async createDevice(req, res) {
    const options = req.body
    const {userId, authorities} = req
    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const {id, firstTenantId} = userEntity

    const result = await DeviceService.create({userId, id, firstTenantId}, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }
    res.status(StatusCodes.OK).send(result)
  },

  async updateDevice(req, res) {
    const deviceId = req.params.deviceId
    const {userId, authorities} = req
    const options = req.body

    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await DeviceService.update(deviceId, userId, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async removeDevice(req, res) {
    const deviceId = req.params.deviceId

    const result = await DeviceService.delete(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Delete device successful!",
    })
  },

  async getOrCreateDevice(req, res) {
    const {name, tenantId, firstTenantId, label, gatewayId} = req.query
    const result = await DeviceService.getOrCreateDevice(name, tenantId, firstTenantId, label, gatewayId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get or create device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async handleDeviceRPCRequest(req, res) {
    const {deviceId} = req.params
    const {tenantId} = req
    const {method, params} = req.body
    const result = await DeviceService.handleDeviceRPCRequest(deviceId, tenantId, method, params)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Handle device rpc request failed",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async updateDeviceAttributes(req, res) {
    const deviceId = req.params.deviceId
    const {attributes} = req.body
    const {userId, authorities} = req
    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await DeviceService.updateDeviceAttributes(attributes, deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update device attributes!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getGatewayDevices(req, res) {
    const deviceId = req.params.deviceId
    const {userId, authorities} = req
    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await DeviceService.getGatewayDevices(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get gateway devices!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },
}
