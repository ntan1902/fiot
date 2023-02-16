const { WidgetsBundle } = require("../models");
const { Op } = require("sequelize");
const logger = require("../helpers/logger");

const WidgetsBundleDAO = {
  async getAll() {
    return await WidgetsBundle.findAll({
      where: { deleted: false },
    });
  },

  async getAllByTenantId(tenantId) {
    return await WidgetsBundle.findAll({
      where: {
        tenantId: {
          [Op.or]: [null, tenantId],
        },
        deleted: false,
      },
    });
  },

  async getById(bundleId) {
    try {
      return await WidgetsBundle.findByPk(bundleId, { raw: true });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async getByAliasExcludeOwnId(alias, bundleId = null) {
    try {
      return await WidgetsBundle.findOne({
        where: {
          alias,
          id: { [Op.ne]: bundleId },
        },
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async getByAlias(alias) {
    try {
      return await WidgetsBundle.findOne({
        where: {
          alias,
        },
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async create(reqUser, options) {
    try {
      return await WidgetsBundle.create({
        ...options,
        tenantId: reqUser.tenantId,
        createUid: reqUser.userId,
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async update(bundleId, options) {
    try {
      await WidgetsBundle.update({ ...options }, { where: { id: bundleId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async delete(bundleId) {
    try {
      await WidgetsBundle.update(
        { deleted: true },
        { where: { id: bundleId } }
      );

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },
};

module.exports = WidgetsBundleDAO;
