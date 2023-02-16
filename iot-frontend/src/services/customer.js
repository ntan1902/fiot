import {CustomerApi} from "../api";

const getAll = async () => {
    return await CustomerApi.getAll() || []
}

const getById = async (id) => {
    return await CustomerApi.getById(id)
}

const create = (data) => {
    return CustomerApi.create(data)
}

const update = (id, data) => {
    return CustomerApi.update(id, data)
}

const remove = (id) => {
    return CustomerApi.delete(id)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
};