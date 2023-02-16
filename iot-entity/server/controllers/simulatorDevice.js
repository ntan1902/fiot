const SimulatorDeviceService = require("../services/simulatorDevice")
const EntityService = require("../services/entity")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")

module.exports = {
  async getSimulatorDevices(req, res) {
    const {userId, authorities} = req
    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await SimulatorDeviceService.getAll({...userEntity, authorities})
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get simulator devices!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getSimulatorDevice(req, res) {
    const simulatorDeviceId = req.params.simulatorDeviceId
    const result = await SimulatorDeviceService.getById(simulatorDeviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get simulator device with UUID: ${simulatorDeviceId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createSimulatorDevice(req, res) {
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

    const result = await SimulatorDeviceService.create({userId, id, firstTenantId}, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create simulator device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }
    res.status(StatusCodes.OK).send(result)
  },

  async updateSimulatorDevice(req, res) {
    const simulatorDeviceId = req.params.simulatorDeviceId
    const {userId, authorities} = req
    const options = req.body

    const userEntity = await EntityService.getUserEntity(userId, authorities)
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      })
      return
    }

    const result = await SimulatorDeviceService.update(simulatorDeviceId, userId, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update simulator device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async removeSimulatorDevice(req, res) {
    const simulatorDeviceId = req.params.simulatorDeviceId

    const result = await SimulatorDeviceService.delete(simulatorDeviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete simulator device!",
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

}
