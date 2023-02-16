const {Tenant} = require("../models")
const {Op} = require("sequelize")

const TenantDAO = {
    async getAll() {
        return await Tenant.findAll({
            where: {deleted: false},
        })
    },

    async getAllByTenantId(tenantId) {
        return await Tenant.findAll({
            where: {
                id: {[Op.ne]: tenantId},
                tenantId,
                deleted: false,
            },
        })
    },

    async getAllByFirstTenantId(firstTenantId) {
        return await Tenant.findAll({
            where: {
                id: {[Op.ne]: firstTenantId},
                firstTenantId,
                deleted: false,
            },
        })
    },

    async existsByEmail(email) {
        const query = {
            where: {
                email,
            },
        }
        const tenant = await Tenant.findOne(query)
        return tenant !== null
    },

    async getById(tenantId) {
        try {
            return await Tenant.findByPk(tenantId, {raw: true})
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async getByIds(tenantIds) {
        try {
            return await Tenant.findAll({
                where: {
                    id: tenantIds,
                },
            })
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async getByUserId(userId) {
        try {
            return await Tenant.findOne({
                where: {userId},
                raw: true,
            })
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async createWithCreateUid(createUid, options) {
        try {
            return await Tenant.create({
                ...options,
                createUid,
            })
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async create(userId, options) {
        try {
            await Tenant.create({
                ...options,
                userId,
            })

            return true
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async update(tenantId, options) {
        console.log("options", options)
        try {
            await Tenant.update({...options}, {where: {id: tenantId}})
            return true
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async delete(tenantId) {
        try {
            await Tenant.update({deleted: true}, {where: {id: tenantId}})
            return true
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },

    async register(userId, email) {
        try {
            const tenant = await Tenant.create({
                userId,
                email,
            })
            await tenant.update({
                firstTenantId: tenant.id,
                tenantId: tenant.id,
            })
            return tenant
        } catch (e) {
            console.log("error", e.message)
            return false
        }
    },
}

module.exports = TenantDAO
