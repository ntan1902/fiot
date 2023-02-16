const widgetsBundleController = require("../controllers").widgetsBundle;
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
    "/entity/api/widgets-bundles",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    widgetsBundleController.getWidgetsBundles
  );
  app.get(
    "/entity/api/widgets-bundles/:bundleId",
    [authJwt.verifyToken],
    widgetsBundleController.getWidgetsBundle
  );
  app.post(
    "/widgets-bundle",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    widgetsBundleController.createWidgetsBundle
  );
  app.put(
    "/entity/api/widgets-bundles/:bundleId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    widgetsBundleController.updateWidgetsBundle)
  app.delete(
    "/entity/api/widgets-bundles/:bundleId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    widgetsBundleController.deleteWidgetsBundle)
};
