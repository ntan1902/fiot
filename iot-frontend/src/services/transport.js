import {TransportApi} from "../api"

const postTelemetry = (body) => {
  return TransportApi.postTelemetry(body)
}

const generateTelemetryData = (deviceToken, dataSources) => {
  let result = {}

  dataSources.forEach((data) => {
    const {key, type, value, autoGenerate, minValue, maxValue} = data
    if (!autoGenerate) {
      result[key] = value
      return
    }

    if (type === "number") {
      const min = Math.ceil(Number(minValue))
      const max = Math.floor(Number(maxValue))
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)

      result[key] = randomNumber
      return
    }

    if (type === "boolean") {
       // Math.random() = [0, 1)
      result[key] = Math.random() < 0.5
      return 
    }
  })

  return {
    token: deviceToken,
    json: result
  }
}

export default {
  postTelemetry,
  generateTelemetryData,
}
