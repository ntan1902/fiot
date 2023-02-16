module.exports = (sequelize, Sequelize) => {
    const CustomerDashboard = sequelize.define(
        "customer_dashboard",
        {
            customerId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "customer",
                    key: "id",
                },
            },
            dashboardId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "dashboard",
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

    return CustomerDashboard
}
