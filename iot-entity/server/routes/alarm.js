const alarmController = require('../controllers/alarm')
const {validator, authJwt} = require('../middleware')
const constants = require('../helpers/constant')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    )
    next();
  })

  app.get(
    "/entity/api/alarms/:deviceId",
    [
      authJwt.verifyToken
    ],
    alarmController.getAlarmsByDeviceId
  )
}