import { WidgetTypeApi } from '../api'

const getAll = async (bundleAlias) => {
  return (await WidgetTypeApi.getAll(bundleAlias)) || []
}

const getById = async (id) => {
  return await WidgetTypeApi.getById(id)
}

const create = (data) => {
  return WidgetTypeApi.create(data)
}

const update = (id, data) => {
  return WidgetTypeApi.update(id, data)
}

const remove = (id) => {
  return WidgetTypeApi.delete(id)
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
}
