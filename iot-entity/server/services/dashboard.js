const DashboardDAO = require("../dao/dashboard")
const constant = require("../helpers/constant")
const logger = require("../helpers/logger")
const db = require("../models/index")

const handleDashboardAssignation = async (assignedCustomerIds, dashboardId) => {
  const existingCustomer = await DashboardDAO.getDashboardCustomers(dashboardId)
  const existingCustomerIds = existingCustomer.map((c) => c.customerId)

  if (existingCustomerIds.length === 0) {
    await DashboardDAO.assignCustomersToDashboard(assignedCustomerIds, dashboardId)
  } else {
    const unassignedCustomerIds = existingCustomerIds.filter((c) => !assignedCustomerIds.includes(c))
    const newAssignedCustomerIds = assignedCustomerIds.filter((c) => !existingCustomerIds.includes(c))

    try {
      await db.sequelize.transaction(async (t) => {
        await DashboardDAO.unassignCustomersFromDashboard(unassignedCustomerIds, dashboardId)
        await DashboardDAO.assignCustomersToDashboard(newAssignedCustomerIds, dashboardId)
      })
    } catch (e) {
      logger.error("assign_customer_dashboard_transaction-" + e.message)
    }
  }
}

const DashboardService = {
  async getAll(userEntity) {
    const {authorities, id, firstTenantId} = userEntity
    let rawDashboards = []
    if (authorities.includes(constant.ROLE_ADMIN)) {
      rawDashboards = await DashboardDAO.getAll()
    }

    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const dashboardIds = await DashboardDAO.getCustomerDashboards(id)
      rawDashboards = await DashboardDAO.getByDashboardIds(dashboardIds)
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      // Is first class tenant
      if (id === firstTenantId) {
        rawDashboards = await DashboardDAO.getAllByFirstTenantId(id)
      } else {
        rawDashboards = await DashboardDAO.getAllByTenantId(id)
      }
    }

    const dashboards = rawDashboards.map((dashboard) => {
      const obj_configuration = JSON.parse(dashboard.configuration)
      const _dashboard = {
        ...dashboard.dataValues,
        configuration: obj_configuration,
      }
      return _dashboard
    })

    return dashboards
  },

  async getById(dashboardId) {
    const rawDashboard = await DashboardDAO.getById(dashboardId)
    const obj_configuration = JSON.parse(rawDashboard.configuration)
    return {
      ...rawDashboard,
      configuration: obj_configuration,
    }
  },

  async create(reqUser, options) {
    const {configuration, assignedCustomers, ...restOptions} = options
    try {
      const str_configuration = JSON.stringify(configuration)

      const createDashboard = await DashboardDAO.create(reqUser, {
        configuration: str_configuration,
        ...restOptions,
      })

      await DashboardDAO.assignCustomersToDashboard(assignedCustomers, createDashboard.id)

      return this.getById(createDashboard.id)
    } catch (e) {
      console.log("Error occurred while create dashboard", e)
      return null
    }
  },

  async update(dashboardId, options) {
    const updatedDashboard = await DashboardDAO.getById(dashboardId)
    const {assignedCustomers = []} = options

    if (!updatedDashboard) {
      return false
    }

    await DashboardDAO.update(dashboardId, options)
    await handleDashboardAssignation(assignedCustomers, dashboardId)
    return this.getById(dashboardId)
  },

  async updateConfiguration(dashboardId, options) {
    const updatedDashboard = await DashboardDAO.getById(dashboardId)

    if (!updatedDashboard) {
      return false
    }

    await DashboardDAO.updateConfiguration(dashboardId, options.configuration)

    return this.getById(dashboardId)
  },

  async delete(dashboardId) {
    return DashboardDAO.delete(dashboardId)
  },

  async assignCustomers(customers, dashboardId) {
    return DashboardDAO.assignCustomers(customers, dashboardId)
  },
}

module.exports = DashboardService
