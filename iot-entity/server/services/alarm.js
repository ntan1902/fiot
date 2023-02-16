const AlarmDAO = require("../dao/alarm")

const AlarmService = {
    async getAllByDeviceId(deviceId) {
        return AlarmDAO.getAllByDeviceId(deviceId)
    },

    async getById(alarmId) {
        return await AlarmDAO.getById(alarmId)
    },

    async create(options) {
        const createAlarm = await AlarmDAO.create(options)

        return await this.getById(createAlarm.id)
    },
}

module.exports = AlarmService
