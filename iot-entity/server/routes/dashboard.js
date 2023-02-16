const dashboardController = require("../controllers").dashboard;
const { authJwt } = require("../middleware");
const constants = require("../helpers/constant");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    );
    next();
  });

  app.get(
    "/entity/api/dashboards",
    [authJwt.verifyToken],
    dashboardController.getDashboards
  );
  app.get(
    "/entity/api/dashboards/:dashboardId",
    [authJwt.verifyToken],
    dashboardController.getDashboard
  );
  app.post(
    "/entity/api/dashboard",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.createDashboard
  );
  app.put(
    "/entity/api/dashboards/:dashboardId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.updateDashboard
  );

  app.put(
    "/entity/api/dashboards/:dashboardId/configuration",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.updateDashboardConfiguration
  );

  app.delete(
    "/entity/api/dashboards/:dashboardId",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.deleteDashboard
  );

  app.post(
    "/entity/api/dashboards/:dashboardId/customer",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.assignDashboardCustomer
  );
};
