const widgetTypeController = require("../controllers").widgetType;
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
    "/entity/api/widget-types",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    widgetTypeController.getWidgetTypes
  );
  app.get(
    "/entity/api/widget-types/:widgetId",
    [authJwt.verifyToken],
    widgetTypeController.getWidgetType
  );
  app.post(
    "/entity/api/widget-type",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    widgetTypeController.createWidgetType
  );
  app.put(
    "/entity/api/widget-types/:widgetId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    widgetTypeController.updateWidgetType)
  app.delete(
    "/entity/api/widget-types/:widgetId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    widgetTypeController.deleteWidgetType)
};
