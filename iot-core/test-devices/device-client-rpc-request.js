const mqtt = require('mqtt');

const HOST = "localhost"
const PORT = "1883"
const client = mqtt.connect(`mqtt://${HOST}:${PORT}`);

const deviceId = '91cf965b-0cb6-469e-b9b5-1cf8d4fe6f7'

client.on('connect', function () {
  console.log('connected');
  client.subscribe(`/v1/client/rpc/response/${deviceId}/+`);

  const requestId = 1;
  const data = {
    method: "getCurrentTime",
    params: {}
  }

  //client acts as an echo service
  client.publish(`/v1/client/rpc/request/${deviceId}/${requestId}`, JSON.stringify(data));

});

client.on('message', function (topic, message) {
  console.log('request.topic: ' + topic);
  console.log('request.body: ' + message.toString());

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
