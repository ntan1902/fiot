import { WidgetsBundleApi } from '../api'

const getAll = async () => {
  return (await WidgetsBundleApi.getAll()) || []
}

const getById = async (id) => {
  return await WidgetsBundleApi.getById(id)
}

const create = (data) => {
  return WidgetsBundleApi.create(data)
}

const update = (id, data) => {
  return WidgetsBundleApi.update(id, data)
}

const remove = (id) => {
  return WidgetsBundleApi.delete(id)
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
}
