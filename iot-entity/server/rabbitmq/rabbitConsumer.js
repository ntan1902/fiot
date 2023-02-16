const amqp = require("amqplib/callback_api")
const AlarmService = require("../services/alarm")
const DeviceService = require("../services/device")
const {MESSAGE_QUEUE} = require("../helpers/constant");

function getJsonMsg(msg) {
  const jsonMsg = JSON.parse(msg)
  console.log("Message consumed:", jsonMsg)
  return jsonMsg;
}

const onAlarmQueueMsg = async (msg) => {
  const data = JSON.parse(getJsonMsg(msg).data);
  const existDevice = await DeviceService.getById(data.deviceId)
  if (existDevice) {
    const {deviceId, name, severity, detail} = data
    await AlarmService.create({deviceId, name, severity, detail})
  }
}

const onDeviceTelemetryQueueMsg = async (msg) => {
  const jsonMsg = getJsonMsg(msg)
  console.log(jsonMsg)
  DeviceService.updateLastActiveTime(jsonMsg.entityId);
}

const onDeviceRpcResponseQueueMsg = async (msg) => {
  const jsonMsg = getJsonMsg(msg)
  console.log(jsonMsg)
  DeviceService.receiveRpcResponseFromDevice({
    key: jsonMsg.key,
    response: jsonMsg.data
  });
}

const RabbitMQConsumer = {
  startService() {
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
                MESSAGE_QUEUE.ALARM_EXCHANGE,
                MESSAGE_QUEUE.ALARM_TYPE,
                {
                  durable: true,
                }
            )

            channel.assertExchange(
                MESSAGE_QUEUE.DEVICE_TELEMETRY_EXCHANGE,
                MESSAGE_QUEUE.DEVICE_TELEMETRY_TYPE,
                {
                  durable: true,
                }
            )

            channel.assertExchange(
                MESSAGE_QUEUE.DEVICE_RPC_RESPONSE_EXCHANGE,
                MESSAGE_QUEUE.DEVICE_RPC_TYPE,
                {
                  durable: true,
                }
            )

            channel.assertQueue(
                MESSAGE_QUEUE.ALARM_QUEUE,
                {
                  exclusive: false
                },
                function (assertQueueError, q) {
                  if (assertQueueError) {
                    throw assertQueueError
                  }
                  console.log(
                      " [*] Waiting for messages in %s. To exit press CTRL+C",
                      q.queue
                  )

                  channel.bindQueue(q.queue, MESSAGE_QUEUE.ALARM_EXCHANGE, "")

                  channel.consume(
                      q.queue,
                      function (msg) {
                        try {
                          onAlarmQueueMsg(msg.content.toString())
                        } catch (e) {
                          console.log("Error occurred", e);
                        }
                      },
                      {
                        noAck: true,
                      }
                  )
                }
            )

            channel.assertQueue(
                MESSAGE_QUEUE.DEVICE_TELEMETRY_QUEUE,
                {
                  exclusive: false
                },
                function (assertQueueError, q) {
                  if (assertQueueError) {
                    throw assertQueueError
                  }
                  console.log(
                      " [*] Waiting for messages in %s. To exit press CTRL+C",
                      q.queue
                  )

                  channel.bindQueue(q.queue,
                      MESSAGE_QUEUE.DEVICE_TELEMETRY_EXCHANGE, "")

                  channel.consume(
                      q.queue,
                      function (msg) {
                        try {
                          onDeviceTelemetryQueueMsg(msg.content.toString())
                        } catch (e) {
                          console.log("Error occurred", e);
                        }
                      },
                      {
                        noAck: true,
                      }
                  )
                }
            )

            channel.assertQueue(
                MESSAGE_QUEUE.DEVICE_RPC_RESPONSE_QUEUE,
                {
                  exclusive: false
                },
                function (assertQueueError, q) {
                  if (assertQueueError) {
                    console.log(assertQueueError)
                    throw assertQueueError
                  }
                  console.log(
                      " [*] Waiting for messages in %s. To exit press CTRL+C",
                      q.queue
                  )

                  channel.bindQueue(q.queue,
                      MESSAGE_QUEUE.DEVICE_RPC_RESPONSE_EXCHANGE, "")

                  channel.consume(
                      q.queue,
                      function (msg) {
                        try {
                          onDeviceRpcResponseQueueMsg(msg.content.toString())
                        } catch (e) {
                          console.log("Error occurred", e);
                        }
                      },
                      {
                        noAck: true,
                      }
                  )
                }
            )
          })
        })
  },
}

module.exports = RabbitMQConsumer
