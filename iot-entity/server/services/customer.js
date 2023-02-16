const CustomerDAO = require("../dao/customer")
const AuthApi = require("../external-api/auth")
const constant = require("../helpers/constant")

const CustomerService = {
  async getAll(reqUser) {
    const {authorities, id, firstTenantId} = reqUser
    if (authorities.includes(constant.ROLE_ADMIN)) return await CustomerDAO.getAll()

    let customerList = []

    if (authorities.includes(constant.ROLE_TENANT)) {
      let customers = []
      // Is first class tenant
      if (id === firstTenantId) {
        customers = await CustomerDAO.getAllByFirstTenantId(firstTenantId)
      } else {
        customers = await CustomerDAO.getAllByTenantId(id)
      }
      customerList = [...customerList, ...customers]
    }

    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const customers = await CustomerDAO.getAllByCustomerId(id)
      customerList = [...customerList, ...customers]
    }
    return customerList
  },

  async getById(customerId) {
    const customer = await CustomerDAO.getById(customerId)

    return {
      ...customer,
    }
  },

  async getByUserId(userId) {
    return await CustomerDAO.getByUserId(userId)
  },

  async create(reqUser, options, token) {
    const {email, firstName, lastName, authorities, ...restOptions} = options
    const {authorities: reqUserAuthorities, id: reqUserId, firstTenantId} = reqUser
    let tenantId = null
    let customerId = null

    if (reqUserAuthorities.includes(constant.ROLE_CUSTOMER)) {
      customerId = reqUserId
    }

    if (reqUserAuthorities.includes(constant.ROLE_TENANT)) {
      tenantId = reqUserId
    }

    // call external-api to create new user and retreive userId
    const userId = await AuthApi.createUser({email, firstName, lastName, authorities, tenantId, customerId}, token)

    if (!userId) {
      return false
    }

    const createCustomer = await CustomerDAO.createWithCreateUid(userId, reqUser.userId, {
      ...restOptions,
      email,
      tenantId,
      customerId,
      firstTenantId,
    })

    return await this.getById(createCustomer.id, token)
  },

  async update(customerId, options, token) {
    const {email, firstName, lastName, deleted = false, ...restOptions} = options
    const updatedCustomer = await CustomerDAO.getById(customerId)

    if (!updatedCustomer) {
      return false
    }

    await CustomerDAO.update(customerId, restOptions)

    return await this.getById(customerId, token)
  },

  async delete(customerId, token) {
    const customerUser = await CustomerDAO.getById(customerId)
    if (customerUser.userId) {
      await AuthApi.deleteUser(customerUser.userId, token)
      return await CustomerDAO.delete(customerId)
    }
    return false
  },
}

module.exports = CustomerService
