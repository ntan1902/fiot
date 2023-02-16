// create an empty modbus client
const ModbusRTU = require("modbus-serial");
const DynamicConfig = require("../service/dynamic_config");
const MessageConverter = require("../helpers/message_converter");

class ModbusConnector {

    constructor(config, gateway) {
        this.master = new ModbusRTU();
        this.gateway = gateway;
        // this.availableFunctions = {
        //     1: this.master.readCoils,
        //     2: this.master.readDiscreteInputs,
        //     3: this.master.readHoldingRegisters,
        //     4: this.master.readInputRegisters,
        //     5: this.master.writeCoil,
        //     6: this.master.writeRegister,
        //     15: this.master.writeCoils,
        //     16: this.master.writeRegisters,
        // }
        this.slaves = DynamicConfig.getConnectorConfig(config).slaves;
    }

    run() {
        setInterval(async () => {
            // read the values of registers starting at address
            // on device number. and log the values to the console.
            for (let slave of this.slaves) {
                let json = {}

                json["deviceName"] = slave["deviceName"]
                json["deviceLabel"] = slave["deviceLabel"]

                for (let ts of slave["timeseries"]) {
                    // open connection to a tcp line
                    await this.master?.connectTCP(slave["host"], {port: slave["port"]});
                    this.master?.setID(slave["unitId"]);
                    this.master?.setTimeout(slave["timeout"])

                    try {
                        const res = await this.master.readHoldingRegisters(ts["address"], ts["registerCount"])
                        json = MessageConverter.generateJson(ts["type"], ts["key"], res.data[0], json)
                    } catch (err) {
                        console.log(err)
                    }
                }
                this.gateway.gwSendTelemetry(json);
            }
        }, 5000)
    }
}

module.exports = ModbusConnector

