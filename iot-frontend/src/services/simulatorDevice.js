import {SimulatorDeviceApi} from "../api";

const getAll = async () => {
  return await SimulatorDeviceApi.getAll() || []
}

const getById = async (id) => {
  return await SimulatorDeviceApi.getById(id)
}

const create = async (data) => {
  return await SimulatorDeviceApi.create(data)
}

const update = async (id, data) => {
  return await SimulatorDeviceApi.update(id, data)
}

const remove = (id) => {
  return SimulatorDeviceApi.delete(id)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};