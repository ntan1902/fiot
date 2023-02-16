const {Dashboard, CustomerDashboard, Customer} = require("../models")
const {Op} = require("sequelize")
const logger = require("../helpers/logger")

const DashboardDAO = {
  async getAll() {
    return Dashboard.findAll({
      where: {
        deleted: false
      },
      include: [
        {
          model: CustomerDashboard,
          attributes: ["customerId"],
          as: "dashboardCustomers"
        }
      ]
    })
  },

  async getAllByTenantId(tenantId) {
    return Dashboard.findAll({
      where: {
        tenantId,
        deleted: false,
      },
      include: [
        {
          model: CustomerDashboard,
          attributes: ["customerId"],
          as: "dashboardCustomers"
        }
      ],
    })
  },

  async getAllByFirstTenantId(firstTenantId) {
    return Dashboard.findAll({
      where: {
        firstTenantId,
        deleted: false,
      },
      include: [
        {
          model: CustomerDashboard,
          attributes: ["customerId"],
          as: "dashboardCustomers"
        }
      ],
    })
  },

  async getById(dashboardId) {
    try {
      return Dashboard.findByPk(dashboardId, {raw: true})
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getByDashboardIds(dashboardIds) {
    const dashboardQuery = {
      where: {
        id: dashboardIds,
      },
      include: [
        {
          model: CustomerDashboard,
          attributes: ["customerId"],
          as: "dashboardCustomers",
          include: {
            model: Customer,
          },
        }
      ],
    }

    return Dashboard.findAll(dashboardQuery, {raw: true})
  },

  async getByTitleExcludeOwnId(title, dashboardId = null) {
    try {
      return Dashboard.findOne({
        where: {
          title,
          id: {[Op.ne]: dashboardId},
        },
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async create(reqUser, options) {
    try {
      return Dashboard.create({
        ...options,
        tenantId: reqUser.id,
        firstTenantId: reqUser.firstTenantId,
        createUid: reqUser.userId,
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async update(dashboardId, options) {
    try {
      await Dashboard.update({...options}, {where: {id: dashboardId}})

      return true
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async updateConfiguration(dashboardId, widgets) {
    try {
      await Dashboard.update({configuration: widgets}, {where: {id: dashboardId}})

      return true
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async delete(dashboardId) {
    try {
      await Dashboard.update({deleted: true}, {where: {id: dashboardId}})

      return true
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getDashboardCustomers(dashboardId) {
    try {
      const customers = await CustomerDashboard.findAll({
        where: {
          dashboardId,
        },
        attributes: ["customerId"],
        include: [
          {
            model: Customer,
            required: true,
          },
        ],
        //raw: true,
      })
      return customers
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async getCustomerDashboards(customerId) {
    try {
      const assignedDashboards = await CustomerDashboard.findAll({
        where: {
          customerId,
        },
        attributes: ["dashboardId"],
        raw: true,
      })
      return assignedDashboards.map((d) => d.dashboardId)
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async assignCustomersToDashboard(customerIds, dashboardId) {
    try {
      const createRecords = customerIds.map((t) => {
        return {
          customerId: t,
          dashboardId,
        }
      })
      return CustomerDashboard.bulkCreate(createRecords)
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },

  async unassignCustomersFromDashboard(customerIds, dashboardId) {
    try {
      return CustomerDashboard.destroy({
        where: {
          dashboardId,
          customerId: customerIds,
        },
      })
    } catch (e) {
      logger.error(e.message)
      return false
    }
  },
}

module.exports = DashboardDAO
