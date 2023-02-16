const ModbusConnector = require("../connectors/modbus_connector");
const MqttConnector = require("../connectors/mqtt_connector");
const RestConnector = require("../connectors/rest_connector");


const connectorsMapping = {
    "modbus": ModbusConnector,
    "mqtt": MqttConnector,
    "rest": RestConnector
};

const DynamicClass = {
    getConnectorClass(type, config, gateway) {
        return new connectorsMapping[type](config, gateway);
    }
}

module.exports = DynamicClass