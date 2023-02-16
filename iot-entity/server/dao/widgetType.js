const { WidgetType } = require("../models");
const { Op } = require("sequelize");
const logger = require("../helpers/logger");

const WidgetTypeDAO = {
  async getAll() {
    return await WidgetType.findAll({
      where: { deleted: false },
    });
  },

  async getAllByTenantId(tenantId) {
    return await WidgetType.findAll({
      where: {
        tenantId: {
          [Op.or]: [null, tenantId],
        },
        deleted: false,
      },
    });
  },

  async getByAlias(alias) {
    try {
      return await WidgetType.findOne({
        where: {
          alias,
        },
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async getById(widgetId) {
    try {
      return await WidgetType.findByPk(widgetId, { raw: true });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async getByAliasExcludeOwnId(alias, widgetId = null) {
    try {
      return await WidgetType.findOne({
        where: {
          alias,
          id: { [Op.ne]: widgetId },
        },
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async create(reqUser, options) {
    try {
      return await WidgetType.create({
        ...options,
        tenantId: reqUser.tenantId,
        createUid: reqUser.userId,
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async update(widgetId, options) {
    try {
      await WidgetType.update({ ...options }, { where: { id: widgetId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async delete(widgetId) {
    try {
      await WidgetType.update({ deleted: true }, { where: { id: widgetId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },
};

module.exports = WidgetTypeDAO;
