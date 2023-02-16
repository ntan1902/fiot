const { Customer } = require("../models");

const CustomerDAO = {
  async getAll() {
    return await Customer.findAll({
      where: {deleted: false}
    });
  },

  async getAllByTenantId(tenantId) {
    return await Customer.findAll({
      where: {
        tenantId,
        deleted: false,
      },
    });
  },

  async getAllByFirstTenantId(firstTenantId) {
    return await Customer.findAll({
      where: {
        firstTenantId,
        deleted: false,
      },
    });
  },

  async getAllByCustomerId(customerId) {
    return await Customer.findAll({
      where: {
        customerId,
        deleted: false,
      },
    });
  },

  async existsByEmail(email) {
    const query = {
      where: {
        email,
      },
    };
    return (await Customer.findOne(query)) !== null;
  },

  async getById(customerId) {
    try {
      return await Customer.findByPk(customerId, {raw: true});
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByUserId(userId) {
    try {
      return await Customer.findOne({
        where: { userId },
        raw: true
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async createWithCreateUid(userId, createUid, options) {
    try {
      return await Customer.create({
        ...options,
        userId,
        createUid,
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async update(customerId, options) {
    try {
      await Customer.update({ ...options }, { where: { id: customerId } });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async delete(customerId) {
    try {
      await Customer.update({ deleted: true }, { where: { id: customerId } });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },
};

module.exports = CustomerDAO;
