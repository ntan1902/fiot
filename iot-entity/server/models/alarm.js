const {v4: uuidv4} = require("uuid")

module.exports = (sequelize, Sequelize) => {
    const Alarm = sequelize.define(
        "alarm",
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            deviceId: {
                type: Sequelize.UUID,
                references: {
                    model: "device",
                    key: "id",
                },
            },
            name: {
                type: Sequelize.STRING,
            },
            severity: {
                type: Sequelize.STRING,
            },
            detail: {
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
                    exclude: ["deleted", "createUid", "updateUid"],
                },
            },
        }
    )

    Alarm.beforeCreate((alarm) => (alarm.id = uuidv4()))
    return Alarm
}
