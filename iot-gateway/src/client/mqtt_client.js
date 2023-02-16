const mqtt = require('mqtt')


class MqttClient {
    constructor(config) {
        this.client = mqtt.connect('', {host: config.host, port: config.port, protocolVersion: config.protocolVersion})
    }
    publishData(topic, data, qos = 0) {
        data = JSON.stringify(data)
        this.client?.publish(topic, data, {qos: qos})
    }
}

module.exports = MqttClient
