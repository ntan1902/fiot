const DynamicConfig = require("../service/dynamic_config");
const express = require("express")
const logger = require("morgan")
const bodyParser = require("body-parser")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")
const MessageConverter = require("../helpers/message_converter");

class RestConnector {
  constructor(config, gateway) {
    this._config = DynamicConfig.getConnectorConfig(config)
    this._gateway = gateway

    this._configEndpointMap = {}

    this._config["mapping"].forEach(mapping => {
      this._configEndpointMap[mapping["endpoint"]] = mapping
    })

    this._app = express()

    this._app.use(logger("dev"))
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: false}))

    this._app.listen(this._config["port"], this._config["host"], () => {
      console.log("Express server listening on port %d in %s", this._config["port"], this._config["host"]);
    })

    this._app.use((req, res, next) => {
      res.header(
          "Access-Control-Allow_Headers",
          `Origin, Content-Type, Accept`
      )
      next();
    })

    this._app.head("/", (req, res) => {
      return res.status(StatusCodes.OK).send()
    })
  }

  run() {
    const app = this._app
    const gateway = this._gateway
    const config = this._config
    const configEndpointMap = this._configEndpointMap

    config["mapping"].forEach(mapping => {
      mapping['HTTPMethods'].forEach(httpMethod => {
        switch (httpMethod) {
          case "GET":
            app.get(mapping.endpoint, handleRequest)
            break
          case "POST":
            app.post(mapping.endpoint, handleRequest)
            break
          case "PUT":
            app.put(mapping.endpoint, handleRequest)
            break
          case "PATCH":
            app.patch(mapping.endpoint, handleRequest)
            break

        }
      })
    })

    function handleRequest(req, res) {
      const data = convertDataFromRequest(req)
      const convertedData = convertData(data, configEndpointMap[req.url]["converter"])
      gateway.gwSendTelemetry(convertedData)
      res.status(StatusCodes.OK).send()
    }

  }

}

function convertDataFromRequest(req) {
  if (req.method === 'GET') {
    return req.query
  } else {
    return req.body
  }
}

function convertData(data, converter) {
  let json = {}

  const deviceName = MessageConverter.convert(converter['deviceNameExpression'], data)
  const deviceLabel = MessageConverter.convert(converter['deviceLabelExpression'], data)

  json["deviceName"] = deviceName;
  json["deviceLabel"] = deviceLabel;

  converter['timeseries'].forEach(ts => {
    const {type: typeTs, key: keyTs, value: valueTs} = ts

    const key = MessageConverter.convert(keyTs, data)
    const value = MessageConverter.convert(valueTs, data)

    json = MessageConverter.generateJson(typeTs, key, value, json)
  })

  return json
}

module.exports = RestConnector
