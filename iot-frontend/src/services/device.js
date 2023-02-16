import {DeviceApi} from "../api";

const getAll = async () => {
  return DeviceApi.getAll() || []
}

const getById = async (id) => {
  return DeviceApi.getById(id)
}

const create = async (data) => {
  return DeviceApi.create(data)
}

const update = async (id, data) => {
  return DeviceApi.update(id, data)
}

const remove = (id) => {
  return DeviceApi.delete(id)
}

const getCredentialsById = async (deviceId) => {
  return DeviceApi.getCredentialsById(deviceId)
}

const updateCredentials = async (deviceId, data) => {
  return DeviceApi.updateCredentials(deviceId, data)
}

const updateAttributes = async (deviceId, data) => {
  return DeviceApi.updateAttributes(deviceId, data)
}

const getGatewayDevices = async (deviceId) => {
  return DeviceApi.getGatewayDevices(deviceId)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getCredentialsById,
    updateCredentials,
    updateAttributes,
    getGatewayDevices
};