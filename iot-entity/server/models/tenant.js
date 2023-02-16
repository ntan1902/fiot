const {v4: uuidv4} = require("uuid")

module.exports = (sequelize, Sequelize) => {
    const Tenant = sequelize.define(
        "tenant",
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
            },
            email: {
                type: Sequelize.STRING,
            },
            tenantId: {
                type: Sequelize.UUID,
            },
            firstTenantId: {
                type: Sequelize.UUID,
            },
            title: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
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

    Tenant.beforeCreate((tenant) => (tenant.id = uuidv4()))

    return Tenant
}
