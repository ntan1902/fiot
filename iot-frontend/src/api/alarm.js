import {API_ALARM, API_ENTITY_SERVICE} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const AlarmApi = {
    getAllByDeviceId: async (deviceId) => {
        return AxiosApi.get(`${API_ENTITY_SERVICE}/${API_ALARM}s/${deviceId}`);
    },
};
