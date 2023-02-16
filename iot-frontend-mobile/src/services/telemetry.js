import { TelemetryApi } from '../api'

const getByDeviceId = async (deviceId) => {
  return await TelemetryApi.getByDeviceId(deviceId)
}

const getLatestByDeviceId = async (deviceId) => {
  return await TelemetryApi.getLatestByDeviceId(deviceId)
}

export default {
  getByDeviceId,
  getLatestByDeviceId,
}
