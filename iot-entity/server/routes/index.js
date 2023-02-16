const deviceRoutes = require("./device")
const customerRoutes = require("./customer")
const tenantRoutes = require("./tenant")
const widgetsBundleRoute = require("./widgetsBundle")
const widgetTypeRoute = require("./widgetType")
const dashboardRoute = require("./dashboard")
const alarmRoute = require("./alarm")
const simulatorDeviceRoute = require("./simulatorDevice")

module.exports = (app) => {
  deviceRoutes(app),
    customerRoutes(app),
    tenantRoutes(app),
    widgetsBundleRoute(app),
    widgetTypeRoute(app),
    dashboardRoute(app),
    alarmRoute(app),
    simulatorDeviceRoute(app)
}
