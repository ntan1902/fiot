const customerController = require('../controllers').customer
const {authJwt} = require('../middleware')
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
    "/entity/api/customers",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.getCustomers)
  app.get(
    "/entity/api/customers/:customerId",
    [
      authJwt.verifyToken
    ],
    customerController.getCustomer)
  app.put(
    "/entity/api/customers/:customerId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.updateCustomer)
  app.delete(
    "/entity/api/customers/:customerId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.deleteCustomer)
  
  app.post(
    "/entity/api/customer",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.createCustomer)
}