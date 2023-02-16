import { TenantApi } from '../api'

const getAll = async () => {
  return (await TenantApi.getAll()) || []
}

const getById = async (id) => {
  return await TenantApi.getById(id)
}

const create = (data) => {
  return TenantApi.create(data)
}

const update = (id, data) => {
  return TenantApi.update(id, data)
}

const remove = (id) => {
  return TenantApi.delete(id)
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
}
