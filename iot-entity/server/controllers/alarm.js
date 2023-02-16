const AlarmService = require('../services/alarm')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAlarmsByDeviceId(req, res) {
    const deviceId = req.params.deviceId
    const result = await AlarmService.getAllByDeviceId(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get all alarms with device id: ${deviceId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

}