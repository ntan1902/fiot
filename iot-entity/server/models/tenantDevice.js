module.exports = (sequelize, Sequelize) => {
    const TenantDevice = sequelize.define(
        "tenant_device",
        {
            tenantId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "tenant",
                    key: "id",
                },
            },
            deviceId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "device",
                    key: "id",
                },
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

    return TenantDevice
}
