const amqp = require("amqplib/callback_api")
const {MESSAGE_QUEUE} = require("../helpers/constant");

const RabbitMQProducer = {
    sendMessage(message) {
        amqp.connect(`amqp://${MESSAGE_QUEUE.CREDENTIAL}${MESSAGE_QUEUE.HOST}`,
            function (connectError, connection) {
                if (connectError) {
                    throw connectError
                }

                connection.createChannel(function (channelError, channel) {
                    if (channelError) {
                        throw channelError
                    }

                    channel.assertExchange(
                        MESSAGE_QUEUE.DEVICE_RPC_EXCHANGE,
                        MESSAGE_QUEUE.DEVICE_RPC_TYPE, {
                            durable: true,
                        }
                    )

                    const msgStr = JSON.stringify(message);
                    channel.publish(
                        MESSAGE_QUEUE.DEVICE_RPC_EXCHANGE,
                        "",
                        Buffer.from(msgStr)
                    )

                    console.log("[x] Sent %s", msgStr)
                })

                setTimeout(function () {
                    connection.close()
                }, 500)
            })
    },
}

module.exports = RabbitMQProducer