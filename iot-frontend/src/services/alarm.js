import {AlarmApi} from "../api/alarm";

const getAllByDeviceId = async (deviceId) => {
  return await AlarmApi.getAllByDeviceId(deviceId) || []
}

export default {
    getAllByDeviceId
};