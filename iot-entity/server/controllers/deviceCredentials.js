const DeviceCredentialsService = require("../services/deviceCredentials");
const constant = require("../helpers/constant");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

module.exports = {
  async validateToken(req, res) {
    const { token, type } = req.body;
    const result = await DeviceCredentialsService.validateToken(token, type);
    console.log("result", result);

    if (!result) {
      res.status(StatusCodes.OK).send({ device: null });
      return;
    }

    res.status(StatusCodes.OK).send({ device: result });
  },

  async getCredentials(req, res) {
    const deviceId = req.params.deviceId;
    const result = await DeviceCredentialsService.getByDeviceId(deviceId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get credentials",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(StatusCodes.OK).send({ deviceCredentials: result });
  },

  async updateCredentials(req, res) {
    const deviceId = req.params.deviceId;
    const options = req.body;
    const userId = req.userId;
    const result = await DeviceCredentialsService.update(deviceId, {
      userId,
      ...options,
    });
    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can not update credentials!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res
      .status(StatusCodes.OK)
      .send({ message: "Update credentials successfully!" });
  },
};
