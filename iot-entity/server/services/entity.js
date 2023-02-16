const CustomerService = require("../services/customer");
const TenantService = require("../services/tenant");
const TenantDAO = require("../dao/tenant");
const CustomerDAO = require("../dao/customer");
const WidgetsBundleDAO = require("../dao/widgetsBundle");
const WidgetTypeDAO = require("../dao/widgetType");
const DashboardDAO = require("../dao/dashboard")

const constant = require("../helpers/constant");
const logger = require("../helpers/logger");

const EntityService = {
  async getUserEntity(userId, authorities) {
    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const customerUser = await CustomerService.getByUserId(userId);

      if (!customerUser) return false;

      return customerUser
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      const tenantUser = await TenantService.getByUserId(userId);

      if (!tenantUser) return false;

      return tenantUser
    }
  },

  async isExistedEmail(email) {
    if (
      (await TenantDAO.existsByEmail(email)) ||
      (await CustomerDAO.existsByEmail(email))
    ) {
      return true;
    }

    return false;
  },

  async isExistedWidgetsBundleAlias(alias, bundleId = null) {
    if (await WidgetsBundleDAO.getByAliasExcludeOwnId(alias, bundleId)) {
      return true;
    }

    return false;
  },

  async isExistedWidgetTypeAlias(alias, widgetId = null) {
    if (await WidgetTypeDAO.getByAliasExcludeOwnId(alias, widgetId)) {
      return true;
    }

    return false;
  },

  async isExistedDashboardTitle(title, dashboardId = null) {
    if (await DashboardDAO.getByTitleExcludeOwnId(title, dashboardId)) {
      return true;
    }
    
    return false;
  }
};

module.exports = EntityService;
