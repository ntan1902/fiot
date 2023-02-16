module.exports = (sequelize, Sequelize) => {
  const DeviceGateway = sequelize.define(
      "device_gateway",
      {
          deviceId: {
              type: Sequelize.UUID,
              primaryKey: true,
          },
          gatewayId: {
              type: Sequelize.UUID,
              primaryKey: true,
          },
      },
      {
          timestamps: false,
          underscored: true,
          freezeTableName: true,
          defaultScope: {
              attributes: {exclude: ["createdAt", "updatedAt"]},
          },
      }
  )

  return DeviceGateway
}
