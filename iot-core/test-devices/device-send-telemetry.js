const mqtt = require("mqtt")

let gps = require('gps-simulator/gps-simulator.js');
let gpsData = require('gps-simulator/gps-simulator-data.js');

// There are 4 routes in gpsData, named routes01 -> routes04
// Each route, there are 2 directions: AB and BA
// So to get one route data, just use: gpsData.routes01.AB, for example.

let DEVICE_A_ACCESS_TOKEN = "0520f900a18e12a4d12c"
let DEVICE_B_ACCESS_TOKEN = "10cc9d574a42aa2799c0"

let deviceAGpsSimulator = new gps.GpsSimulator(gpsData.routes[Math.floor(Math.random() * gpsData.routes.length)].AB);
let deviceBGpsSimulator = new gps.GpsSimulator(gpsData.routes[Math.floor(Math.random() * gpsData.routes.length)].AB);

const client = mqtt.connect({host: "fiot.me", port: 1883})
client.on("connect", function () {
  console.log("MQTT connected.")

  deviceAGpsSimulator.start(function (position, beStopped, movableObject, currentRouteIndex) {
    const randomTemp = Math.floor(Math.random() * (80 - (-20) + 1) + (-20))
    let str = "Route " + currentRouteIndex + ", speed " + movableObject.velocity * 3.6 + " km/h, temperature " + randomTemp;
    console.log('[ ' + new Date() + ' ] ' + str);

    // Do something you want with gps_sensor
    client.publish('/v1/devices/telemetry/request', JSON.stringify({
      "token": DEVICE_A_ACCESS_TOKEN,
      "json": {
        "temperature": randomTemp,
        "latitude": position.latitude,
        "longitude": position.longitude,
        "speed": movableObject.velocity * 3.6,
      }
    }))

  });

  // deviceBGpsSimulator.start(function (position, beStopped, movableObject, currentRouteIndex) {
  //   const randomTemp = Math.floor(Math.random() * (80 - (-20) + 1) + (-20))
  //   let str = "Route " + currentRouteIndex + ", speed " + movableObject.velocity * 3.6 + " km/h, temperature " + randomTemp;
  //   console.log('[ ' + new Date() + ' ] ' + str);
  //
  //   // Do something you want with gps_sensor
  //   client.publish('/v1/devices/telemetry/request', JSON.stringify({
  //     "token": DEVICE_B_ACCESS_TOKEN,
  //     "json": {
  //       "temperature": randomTemp,
  //       "latitude": position.latitude,
  //       "longitude": position.longitude
  //     }
  //   }))
  //
  // });
})
