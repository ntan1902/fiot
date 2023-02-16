import { DashboardApi } from '../api'

const getAll = async () => {
  return (await DashboardApi.getAll()) || []
}

const getById = async (id) => {
  return await DashboardApi.getById(id)
}

const create = async (data) => {
  return await DashboardApi.create(data)
}

const update = async (id, data) => {
  console.log('datahere', data)
  return await DashboardApi.update(id, data)
}

const updateConfiguration = async (id, data) => {
  return await DashboardApi.updateConfiguration(id, { configuration: data })
}

const remove = async (id) => {
  return await DashboardApi.delete(id)
}

export default {
  getAll,
  getById,
  create,
  update,
  updateConfiguration,
  remove,
}
