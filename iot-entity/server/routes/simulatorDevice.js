const simulatorDeviceController = require("../controllers/simulatorDevice")
const {validator, authJwt} = require("../middleware")
const constants = require("../helpers/constant")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow_Headers", `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`)
    next()
  })

  app.get("/entity/api/simulator-devices", [authJwt.verifyToken], simulatorDeviceController.getSimulatorDevices)
  app.get(
    "/entity/api/simulator-devices/:simulatorDeviceId",
    [authJwt.verifyToken],
    simulatorDeviceController.getSimulatorDevice
  )
  app.put(
    "/entity/api/simulator-devices/:simulatorDeviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    simulatorDeviceController.updateSimulatorDevice
  )
  app.delete(
    "/entity/api/simulator-devices/:simulatorDeviceId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    simulatorDeviceController.removeSimulatorDevice
  )

  app.post(
    "/entity/api/simulator-device",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    simulatorDeviceController.createSimulatorDevice
  )
}
