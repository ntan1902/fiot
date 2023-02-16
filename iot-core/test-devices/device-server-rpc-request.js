const mqtt = require('mqtt');

const HOST = "fiot.me"
const PORT = "1883"
const client = mqtt.connect(`mqtt://${HOST}:${PORT}`, {
  username: "guest",
  password: "guest"
});

const deviceId = '822b0cd3-03c8-45f1-a400-e17778b25f2a'
let isOn = true;

client.on('connect', function () {
  console.log('connected');
  client.subscribe(`/v1/server/rpc/request/${deviceId}/+`)
});

client.on('message', function (topic, message) {
  console.log('request.topic: ' + topic);
  console.log('request.body: ' + message.toString());

  const data = JSON.parse(message.toString());
  const requestId = topic.slice(`/v1/server/rpc/response/${deviceId}`.length);

  if (data.method === 'getValue') {
    //client acts as an echo service
    client.publish(`/v1/server/rpc/response/${requestId}`, "" + isOn);
  } else if (data.method === 'setValue') {
    isOn = data.params
  }
});


















// // -------- THINGSBOARD -------
// var mqtt = require('mqtt');
// var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
//     username: 'abcdeabcde'
// });
//
// client.on('connect', function () {
//     console.log('connected');
//     client.subscribe('v1/devices/me/rpc/request/+')
// });
//
// client.on('message', function (topic, message) {
//     console.log('request.topic: ' + topic);
//     console.log('request.body: ' + message.toString());
//     var requestId = topic.slice('v1/devices/me/rpc/request/'.length);
//     //client acts as an echo service
//     client.publish('v1/devices/me/rpc/response/' + requestId, {method: "connect", params: "hello"}.toString());
// });
