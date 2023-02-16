const WidgetTypeDAO = require("../dao/widgetType");

const WidgetTypeService = {
  async getAllByTenantId(tenantId) {
    return await WidgetTypeDAO.getAllByTenantId(tenantId);
  },

  async getById(widgetId) {
    return await WidgetTypeDAO.getById(widgetId);
  },

  async create(reqUser, options) {
    const createWidgetsBundle = await WidgetTypeDAO.create(reqUser, options);

    return await this.getById(createWidgetsBundle.id);
  },

  async update(widgetId, options) {
    const updatedWidgetsBundle = await WidgetTypeDAO.getById(widgetId);

    if (!updatedWidgetsBundle) {
      return false;
    }

    await WidgetTypeDAO.update(widgetId, options);

    return await this.getById(widgetId);
  },

  async delete(widgetId) {
    return await WidgetTypeDAO.delete(widgetId)
  },
};

module.exports = WidgetTypeService;
