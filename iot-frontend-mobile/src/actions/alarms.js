import {AlarmService} from "../services";
import {LOAD_ALARMS, UPDATE_ALARMS} from "./types";

export const loadAlarmsByDeviceId = (deviceId) => async (dispatch) => {
  const data = await AlarmService.getAllByDeviceId(deviceId)
  if (data && data.length > 0) {
    dispatch({
      type: LOAD_ALARMS,
      payload: {
        deviceId: data[0]?.deviceId,
        alarms: data
      }
    })
  }
  return data
};

export const updateAlarms = (newAlarm) => async (dispatch) => {
  dispatch({
    type: UPDATE_ALARMS,
    payload: newAlarm
  })
}