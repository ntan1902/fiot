const Eureka = require("eureka-js-client").Eureka
const {EUREKA_CREDENTIAL, EUREKA_HOST, EUREKA_PORT, IOT_ENTITY_PORT} = require("../helpers/constant");

const EurekaClient = {
    registerService() {
        const client = new Eureka({
            instance: {
                app: `entity`,
                hostName: EUREKA_HOST,
                ipAddr: EUREKA_HOST,
                instanceId: `entity:${IOT_ENTITY_PORT}`,
                port: {
                    $: parseInt(IOT_ENTITY_PORT),
                    "@enabled": "true",
                },
                statusPageUrl: `http://${EUREKA_HOST}:${IOT_ENTITY_PORT}`,
                vipAddress: `entity`,
                dataCenterInfo: {
                    "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                    name: "MyOwn",
                },
            },
            //retry 10 time for 3 minute 20 seconds.
            eureka: {
                host: `${EUREKA_CREDENTIAL}@${EUREKA_HOST}`,
                port: EUREKA_PORT,
                servicePath: "/eureka/apps/",
                maxRetries: 10,
                requestRetryDelay: 2000,
            },
        })

        client.logger.level("debug")

        try {
            client.start()
        } catch (err) {
            console.log("err", err)
        }
    },
}

module.exports = EurekaClient
