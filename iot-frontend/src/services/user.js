import {AuthApi} from "../api";

const getAll = async (userId) => {
    return await AuthApi.getAllUsers(userId) || []
}

export default {
    getAll,
};