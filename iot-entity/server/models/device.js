const {v4: uuidv4} = require("uuid")

module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define(
      "device",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        tenantId: {
          type: Sequelize.UUID,
          references: {
            model: "tenant",
            key: "id",
          },
        },
        firstTenantId: {
          type: Sequelize.UUID
        },
        ruleChainId: {
          type: Sequelize.UUID,
        },
        deviceData: {
          type: Sequelize.JSON,
        },
        type: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
          unique: true,
        },
        label: {
          type: Sequelize.STRING,
        },
        attributes: {
          type: Sequelize.STRING(10000),
        },
        lastActiveTime: {
          type: Sequelize.DOUBLE,
        },
        idleTime: {
          type: Sequelize.DOUBLE,
          defaultValue: 3000
        },
        isLive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        isHeadCheck: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        headDomain: {
          type: Sequelize.STRING,
        },
        isGateway: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createUid: {
          type: Sequelize.UUID,
        },
        updateUid: {
          type: Sequelize.UUID,
        },
      },
      {
        underscored: true,
        freezeTableName: true,
        defaultScope: {
          attributes: {
            exclude: ["deleted", "createUid", "updateUid", "updatedAt"],
          },
        },
      }
  )

  Device.beforeCreate((device) => (device.id = uuidv4()))
  return Device
}
