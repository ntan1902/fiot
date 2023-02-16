const MqttClient = require("../client/mqtt_client");
const DynamicClass = require("./dynamic_class");

class GatewayService {
    constructor({iot = {}, connectors = []}) {
        this.mqttClient = new MqttClient(iot);
        this.telemetryRequestTopic = iot["telemetryRequestTopic"];
        this.gwTelemetryRequestTopic = iot["gwTelemetryRequestTopic"];
        this.accessToken = iot["security"]["accessToken"];

        connectors.forEach(connector => {
            const connectorClass = DynamicClass.getConnectorClass(connector.type, connector.config, this);
            connectorClass.run();
        })
    }

    sendTelemetry(convertedData) {
        const msg = {
            "token": this.accessToken,
            "json": convertedData,
        }

        console.log(msg)
        this.mqttClient.publishData(this.telemetryRequestTopic, msg);
    }

    gwSendTelemetry(convertedData) {
        const msg = {
            "token": this.accessToken,
            "json": {},
        }

        Object.keys(convertedData).forEach(function(key){
            if (key === "deviceName") {
                msg["json"]["deviceName"] = convertedData["deviceName"]
                delete convertedData["deviceName"]
            }

            if (key === "deviceLabel") {
                msg["json"]["deviceLabel"] = convertedData["deviceLabel"]
                delete convertedData["deviceLabel"]
            }
        });

        msg["json"]["telemetry"] = convertedData
        console.log(msg)
        this.mqttClient.publishData(this.gwTelemetryRequestTopic, msg);
    }
}

module.exports = GatewayService;