const {v4: uuidv4} = require("uuid")

module.exports = (sequelize, Sequelize) => {
  const SimulatorDevice = sequelize.define(
    "simulator_device",
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
      deviceToken: {
        type: Sequelize.STRING,
        unique: true,
      },
      dataSources: {
        type: Sequelize.STRING(10000),
      },
      requestInterval: {
        type: Sequelize.INTEGER,
      },
      isAlive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createUid: {
        type: Sequelize.UUID,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

  SimulatorDevice.beforeCreate((simulatorDevice) => (simulatorDevice.id = uuidv4()))
  return SimulatorDevice
}
