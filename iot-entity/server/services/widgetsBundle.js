const WidgetsBundleDAO = require("../dao/widgetsBundle");

const WidgetsBundleService = {
  async getAllByTenantId(tenantId) {
    return await WidgetsBundleDAO.getAllByTenantId(tenantId);
  },

  async getById(bundleId) {
    return await WidgetsBundleDAO.getById(bundleId);
  },

  async create(reqUser, options) {
    const createWidgetsBundle = await WidgetsBundleDAO.create(reqUser, options);

    return await this.getById(createWidgetsBundle.id);
  },

  async update(bundleId, options) {
    const updatedWidgetsBundle = await WidgetsBundleDAO.getById(bundleId);

    if (!updatedWidgetsBundle) {
      return false;
    }

    await WidgetsBundleDAO.update(bundleId, options);

    return await this.getById(bundleId);
  },

  async delete(bundleId) {
    return await WidgetsBundleDAO.delete(bundleId)
  },
};

module.exports = WidgetsBundleService;
