const tenantController = require('../controllers').tenant
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
    "/entity/api/tenants",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.getTenants)
  app.get(
    "/entity/api/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.getTenant
    )
  app.put(
    "/entity/api/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.updateTenant)
  app.delete(
    "/entity/api/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.deleteTenant)
  
  app.post(
    "/entity/api/tenant",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateField("email"),
      validator.validateAuthorities
    ],
    tenantController.createTenant)

  // Public end-point for register tenant after register new account
  app.post(
    "/entity/api/auth/register-tenant",
    [
      validator.validateField("email")
    ],
    tenantController.registerTenant)
}