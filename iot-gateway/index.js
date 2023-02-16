const yaml = require('js-yaml')
const fs = require('fs')
const GatewayService = require("./src/service/gateway_service")

// Get document, or throw exception on error
try {
    const config = yaml.load(fs.readFileSync('./src/config/iot_gateway.yaml', 'utf8'))
    new GatewayService(config)
} catch (e) {
    console.log("Error occurred: " + e)
}