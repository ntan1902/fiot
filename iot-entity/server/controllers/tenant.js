const TenantService = require("../services/tenant")
const EntityService = require("../services/entity")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")

module.exports = {
    async getTenants(req, res) {
        const {authorities, userId} = req

        const userEntity = await EntityService.getUserEntity(userId, authorities)
        if (!userEntity) {
            res.status(StatusCodes.BAD_REQUEST).send({
                message: "Can't find entity information with provided token.",
            })
            return
        }

        const result = await TenantService.getAll({...userEntity, authorities})

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not get tenants!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async getTenant(req, res) {
        const {token} = req
        const tenantId = req.params.tenantId
        const result = await TenantService.getById(tenantId, token)

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: `Can not get tenant with UUID: ${tenantId}!`,
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async createTenant(req, res) {
        const options = req.body
        const {userId, authorities} = req
        const {email} = options
        const isExistedEmail = await EntityService.isExistedEmail(email)
        if (isExistedEmail) {
            res.status(StatusCodes.BAD_REQUEST).send({
                message: "Email has already existed.",
            })
            return
        }

        const userEntity = await EntityService.getUserEntity(userId, authorities)
        if (!userEntity) {
            res.status(StatusCodes.BAD_REQUEST).send({
                message: "Can't find entity information with provided token.",
            })
            return
        }
        const {id, firstTenantId} = userEntity
        const result = await TenantService.create(
            {id, userId, firstTenantId, authorities},
            options,
            req.token
        )

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not create tenant!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async updateTenant(req, res) {
        const tenantId = req.params.tenantId
        const options = req.body

        const result = await TenantService.update(tenantId, options, req.token)
        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not update tenant!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async deleteTenant(req, res) {
        const tenantId = req.params.tenantId

        const result = await TenantService.delete(tenantId, req.token)
        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not delete tenant!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send({
            message: "Delete tenant successful!",
        })
    },

    async registerTenant(req, res) {
        const {userId, email} = req.body
        const result = await TenantService.register(userId, {email})

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not register tenant!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }
        console.log(result)

        res.status(StatusCodes.OK).send({id: result.id})
    },
}
