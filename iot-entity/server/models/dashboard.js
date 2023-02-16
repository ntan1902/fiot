const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Dashboard = sequelize.define('dashboard', {
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
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    configuration: {
      type: Sequelize.STRING(1000000),
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

  Dashboard.beforeCreate(dashboard => dashboard.id = uuidv4())
  return Dashboard;
};