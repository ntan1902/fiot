const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    tenantId: {
      type: Sequelize.UUID,
      references: {
        model: 'tenant',
        key: 'id'
      }
    },
    firstTenantId: {
      type: Sequelize.UUID
    },
    userId: {
      type: Sequelize.UUID
    },
    email: {
      type: Sequelize.STRING
    },
    customerId: {
      type: Sequelize.UUID
    },
    title: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createUid: {
      type: Sequelize.UUID
    },
    updateUid: {
      type: Sequelize.UUID
    }
  }, {
    underscored: true,
    freezeTableName: true,
    defaultScope: {
      attributes: {exclude: ['deleted', 'createUid', 'updateUid', 'updatedAt']}
    }
  });

  Customer.beforeCreate(customer => customer.id = uuidv4())

  return Customer;
};