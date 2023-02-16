module.exports = (sequelize, Sequelize) => {
    const CustomerDevice = sequelize.define(
        "customer_device",
        {
            customerId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "customer",
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

    return CustomerDevice
}
