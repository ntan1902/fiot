const modbusMasterConfig = require("../config/modbus").master
const mqttConfig = require("../config/mqtt")
const restConfig = require("../config/rest")

const connectorConfigMapping = {
    "modbus.json": modbusMasterConfig,
    "mqtt.json": mqttConfig,
    "rest.json": restConfig
}

const DynamicConfig = {
    getConnectorConfig(configFileName) {
        return connectorConfigMapping[configFileName]
    }
}

module.exports = DynamicConfig

