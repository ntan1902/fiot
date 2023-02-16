const DeviceCredentialsDAO = require("../dao/deviceCredentials")
const DeviceDAO = require("../dao/device")
const constant = require("../helpers/constant")
const crypto = require("crypto")
const TenantDAO = require("../dao/tenant")

const preProcessToken = (credentialsType, credentialsValue) => {
    let rawCredentialsValue
    let credentialsId
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
        // Default case: user don't provide any credentials
        // Note: credentials type ACCESS_TOKEN will have it's credentials_value = null
        if (!credentialsValue || !credentialsValue.accessToken) {
             // generate 20 random chars
            credentialsId = crypto.randomBytes(10).toString("hex")
        } else {
            credentialsId = credentialsValue.accessToken
        }
        rawCredentialsValue = null
    }

    // Note: credentials type X.509 will have it's credentials_id = (SHA256) hash of it's RSA PublicKey
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
        rawCredentialsValue = credentialsValue.RSAPublicKey.replace(
            "-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\n/g, "")
        .trim()
        credentialsId = crypto.createHash("sha256").update(rawCredentialsValue).digest("hex")
    }

    // Note: credentials type MQTT_BASIC will have it's credentials_id
    // = (SHA256) hash of it's stringified object's value (clientId, username, password)
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
        const mqttBasicInfo = {
            clientId: credentialsValue.clientId,
            username: credentialsValue.username,
            password: credentialsValue.password,
        }

        rawCredentialsValue = JSON.stringify(mqttBasicInfo)
        credentialsId = crypto.createHash("sha256").update(rawCredentialsValue).digest("hex")
    }

    return {credentialsId, rawCredentialsValue}
}

const DeviceCredentialsService = {
    async validateToken(token, type, deviceId = null) {
        let credentials = null
        switch (type) {
            case constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN:
                credentials = await DeviceCredentialsDAO.getByCredentialsId(token, deviceId)
                break

            case constant.DEVICE_CREDENTIALS_TYPE_X_509:
                const x509Token = token
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replace(/\n/g, "")
                    .trim()

                const x509HashToken = crypto.createHash("sha256").update(x509Token).digest("hex")
                credentials = await DeviceCredentialsDAO.getByCredentialsId(x509HashToken, deviceId)
                break

            case constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC:
                const mqttBasicToken = JSON.stringify(token)
                const mqttBasicHashToken = crypto.createHash("sha256").update(mqttBasicToken).digest("hex")

                if (deviceId) {
                    credentials = await DeviceCredentialsDAO.getByMqttClientId(mqttBasicToken, deviceId)
                } else {
                    credentials = await DeviceCredentialsDAO.getByCredentialsId(mqttBasicHashToken, deviceId)
                }
                break

            default:
                break
        }

        if (!credentials) return false

        const device = await DeviceDAO.getByIdWithoutCredentials(credentials.deviceId)

        const userIds = await this.getUserIdsRelatedToDevice(device)

        return {
            ...device,
            userIds,
        }
    },

    async create(options) {
        const {
            deviceId,
            credentialsType = constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN,
            credentialsValue,
            createUid,
        } = options

        const {rawCredentialsValue, credentialsId} = preProcessToken(credentialsType, credentialsValue)

        return await DeviceCredentialsDAO.create({
            deviceId,
            credentialsType,
            credentialsId,
            credentialsValue: rawCredentialsValue,
            createUid,
        })
    },

    async getByDeviceId(deviceId) {
        return await DeviceCredentialsDAO.getByDeviceId(deviceId)
    },

    async update(deviceId, options) {
        const {userId, credentialsType, credentialsValue} = options

        const {rawCredentialsValue, credentialsId} = preProcessToken(credentialsType, credentialsValue)

        const updateOptions = {
            credentialsType,
            credentialsId,
            credentialsValue: rawCredentialsValue,
            updateUid: userId,
        }

        return await DeviceCredentialsDAO.update(deviceId, updateOptions)
    },

    async getUserIdsRelatedToDevice(device) {
        const {tenantId, firstTenantId, id} = device
        // Tenant and first Tenant of device
        const tenants = await TenantDAO.getByIds([tenantId, firstTenantId])
        const tenantUserIds = tenants.map((t) => t.userId)
    
        // Assigned Customers
        const assignedCustomers = await DeviceDAO.getDeviceCustomers(id)
        const assignedCustomerUserIds = assignedCustomers.map((c) => c.customer.userId)
    
        // Assigned Tenants
        const assignedTenants = await DeviceDAO.getDeviceTenants(id)
        const assignedTenantUserIds = assignedTenants.map((t) => t.tenant.userId)
    
        return [...new Set([...tenantUserIds, ...assignedCustomerUserIds, ...assignedTenantUserIds])]
    }
}

module.exports = DeviceCredentialsService
