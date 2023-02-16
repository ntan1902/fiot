const deviceController = require("../controllers/device")
const deviceCredentialsController = require("../controllers/deviceCredentials")
const {validator, authJwt} = require("../middleware")
const constants = require("../helpers/constant")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow_Headers", `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`)
    next()
  })

  // Device Details

  app.get("/entity/api/devices", [authJwt.verifyToken], deviceController.getDevices)
  app.get("/entity/api/devices/:deviceId", [authJwt.verifyToken], deviceController.getDevice)
  app.put(
    "/entity/api/devices/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin, validator.validateDeviceDetails],
    deviceController.updateDevice
  )
  app.delete(
    "/entity/api/devices/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    deviceController.removeDevice
  )

  app.post(
    "/entity/api/device",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateDeviceDetails,
      validator.validateDeviceCredentials,
    ],
    deviceController.createDevice
  )

  app.put(
    "/entity/api/devices/attributes/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    deviceController.updateDeviceAttributes
  )

  // Device Credentials
  app.get(
    "/entity/api/devices/credentials/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    deviceCredentialsController.getCredentials
  )

  app.put(
    "/entity/api/devices/credentials/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin, validator.validateDeviceCredentials],
    deviceCredentialsController.updateCredentials
  )

  // Public API-s for validate device credentials by token value
  app.post("/entity/api/device/validate", [validator.validateDeviceToken], deviceCredentialsController.validateToken)

  // Public API-s for IoT device gateway
  app.get("/entity/api/device/get-or-create", deviceController.getOrCreateDevice)

  app.post("/entity/api/device/validate", [validator.validateDeviceToken], deviceCredentialsController.validateToken)

  // RPC Device Request from end user
  app.post(
    "/entity/api/devices/rpc/request/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrCustomer],
    deviceController.handleDeviceRPCRequest
  )

  // Get Gateway Devices
  app.get(
    "/entity/api/devices/gateway-devices/:deviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    deviceController.getGatewayDevices
  )
  // Public API-s for get information device
  app.get("/entity/api/device", deviceController.getDeviceAndUserIds)
}
