const CustomerService = require("../services/customer")
const EntityService = require("../services/entity")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")

module.exports = {
    async getCustomers(req, res) {
        const {authorities, userId} = req
        const userEntity = await EntityService.getUserEntity(userId, authorities)
        if (!userEntity) {
            res.status(StatusCodes.BAD_REQUEST).send({
                message: "Can't find entity information with provided token.",
            })
            return
        }

        const result = await CustomerService.getAll({
            authorities,
            ...userEntity,
        })

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not get customers!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async getCustomer(req, res) {
        const customerId = req.params.customerId
        const result = await CustomerService.getById(customerId)

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: `Can not get customer with UUID: ${customerId}!`,
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async createCustomer(req, res) {
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

        const result = await CustomerService.create(
            {...userEntity, authorities},
            options,
            req.token
        )

        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not create customer!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async updateCustomer(req, res) {
        const customerId = req.params.customerId
        const options = req.body
        const result = await CustomerService.update(customerId, options, req.token)
        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not update customer!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send(result)
    },

    async deleteCustomer(req, res) {
        const customerId = req.params.customerId

        const result = await CustomerService.delete(customerId, req.token)
        if (!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Can not delete customer!",
                status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
            })
            return
        }

        res.status(StatusCodes.OK).send({
            message: "Delete customer successful!",
        })
    },
}
