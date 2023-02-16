const TenantDAO = require("../dao/tenant")
const AuthApi = require("../external-api/auth")
const constant = require("../helpers/constant")

const TenantService = {
  async getAll(userTenant) {
    const {authorities, id: userTenantId, firstTenantId} = userTenant
    if (authorities.includes(constant.ROLE_ADMIN)) return TenantDAO.getAll()

    if (authorities.includes(constant.ROLE_TENANT)) {
      // Is first class tenant
      if (userTenantId === firstTenantId) {
        return TenantDAO.getAllByFirstTenantId(userTenantId)
      }
      return TenantDAO.getAllByTenantId(userTenantId)
    }

    return false
  },

  async getById(tenantId) {
    const tenant = await TenantDAO.getById(tenantId)

    return {
      ...tenant,
    }
  },

  async getByUserId(userId) {
    return TenantDAO.getByUserId(userId)
  },

  async create(reqTenant, options, token) {
    const {email, firstName, lastName, authorities, ...restOptions} = options

    const {id: reqTenantId, firstTenantId, userId: reqTenantUserId} = reqTenant

    const createTenant = await TenantDAO.createWithCreateUid(reqTenantUserId, {
      ...restOptions,
      email,
      tenantId: reqTenantId,
      firstTenantId,
    })

    // call external-api to create new user and retreive userId
    const userId = await AuthApi.createUser({email, firstName, lastName, authorities, tenantId: createTenant.id}, token)
    if (!userId) {
      return false
    }

    await TenantDAO.update(createTenant.id, {userId})

    return this.getById(createTenant.id)
  },

  async register(userId, options) {
    const {email} = options

    if (await TenantDAO.existsByEmail(email)) {
      return false
    }
    return TenantDAO.register(userId, email)
  },

  async update(tenantId, options, token) {
    const {email, firstName, lastName, deleted = false, ...restOptions} = options
    const updatedTenant = await TenantDAO.getById(tenantId)

    if (!updatedTenant) {
      return false
    }

    await TenantDAO.update(tenantId, restOptions)

    return this.getById(tenantId)
  },

  async delete(tenantId, token) {
    const tenantUser = await TenantDAO.getById(tenantId)
    if (tenantUser.userId) {
      await AuthApi.deleteUser(tenantUser.userId, token)
      return TenantDAO.delete(tenantId)
    }
    return false
  },
}

module.exports = TenantService
