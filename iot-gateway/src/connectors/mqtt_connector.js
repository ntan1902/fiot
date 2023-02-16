const mqtt = require("mqtt")
const DynamicConfig = require("../service/dynamic_config")
const MessageConverter = require("../helpers/message_converter")

class MqttConnector {
    constructor(config, gateway) {
        this._config = DynamicConfig.getConnectorConfig(config)
        this._gateway = gateway
        this._configTopicFilterMap = {}

        this._config["mapping"].forEach(mapping => {
            this._configTopicFilterMap[mapping["topicFilter"]] = mapping
        })

    }

    run() {
        const config = this._config
        const gateway = this._gateway
        const options = {
            clientId: config["broker"]["clientId"],
            connectTimeout: 5000,
            username: config["broker"]["security"]["username"],
            password: config["broker"]["security"]["password"],
        }
        const configTopicFilterMap = this._configTopicFilterMap

        // const client = mqtt.connect("mqtt://test.mosquitto.org", options)
        const client = mqtt.connect({host: config.host, port: config.port})

        client.on("connect", function () {
            console.log("MQTT connected.")
            config["mapping"].forEach(mapping => {
                const topic = mapping["topicFilter"]
                client.subscribe(topic, function (error) {
                    console.log(`Topic '${topic}' subscribed.`)
                    if (error) {
                        console.log("Error occur when subscribe", error)
                    }
                })
            })
        })

        client.on("message", function (topic, message) {
            if (!MessageConverter.hasJsonStructure(message.toString())) {
                console.log("Wrong json formatted message.")
                return
            }
            if (topic in configTopicFilterMap) {
                handleOnMessage(JSON.parse(message.toString()), topic)
            }
        })

        function handleOnMessage(message, topic) {
            const convertedData = convertData(message, configTopicFilterMap[topic]["converter"])
            gateway.gwSendTelemetry(convertedData)
        }
    }
}

function convertData(data, converter) {
    let json = {}

    const deviceName = MessageConverter.convert(converter['deviceNameExpression'], data)
    const deviceLabel = MessageConverter.convert(converter['deviceLabelExpression'], data)

    json["deviceName"] = deviceName;
    json["deviceLabel"] = deviceLabel;

    converter["timeseries"].forEach((ts) => {
        const {type: typeTs, key: keyTs, value: valueTs} = ts // long, ${sensorModel}, ${temp}

        const key = MessageConverter.convert(keyTs, data) // [sensorModel]
        const value = MessageConverter.convert(valueTs, data) // [temp]

        json = MessageConverter.generateJson(typeTs, key, value, json)
    })

    return json
}

module.exports = MqttConnector
