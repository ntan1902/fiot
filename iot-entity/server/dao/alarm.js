const {Alarm} = require("../models")
const {Op} = require("sequelize")
const logger = require("../helpers/logger")

const AlarmDAO = {
    async getAllByDeviceId(deviceId) {
        return Alarm.findAll({
            where: {
                deviceId,
                deleted: false,
            },
            order: [["createdAt", "DESC"]]
        })
    },

    async getById(alarmId) {
        try {
            return await Alarm.findByPk(alarmId, {raw: true})
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async create(options) {
        try {
            return await Alarm.create({
                ...options,
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },
}

module.exports = AlarmDAO
