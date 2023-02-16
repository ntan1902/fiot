const mqtt = require("mqtt")

let gps = require('gps-simulator/gps-simulator.js');
let gpsData = require('gps-simulator/gps-simulator-data.js');

let ACCESS_TOKEN_DEVICE = "fca75e350c7d209b7060"

let deviceAGpsSimulator = new gps.GpsSimulator(gpsData.routes[0].AB);

const client = mqtt.connect({host: "localhost", port: 1883})
client.on("connect", function () {
  console.log("MQTT connected.")

  deviceAGpsSimulator.start(function (position, beStopped, movableObject, currentRouteIndex) {
    const randomTemp = Math.floor(Math.random() * (80 - (-20) + 1) + (-20))
    let str = "Route " + currentRouteIndex + ", speed " + movableObject.velocity * 3.6 + " km/h, temperature " + randomTemp;
    console.log('[ ' + new Date() + ' ] ' + str);

    // Do something you want with gps_sensor
    client.publish('/v1/devices/telemetry/request', JSON.stringify({
      "token": ACCESS_TOKEN_DEVICE,
      "json": {
        "temperature": randomTemp,
        "latitude": position.latitude,
        "longitude": position.longitude,
        "speed": movableObject.velocity * 3.6,
      }
    }))

  });
})
