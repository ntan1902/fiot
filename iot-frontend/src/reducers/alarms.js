import {LOAD_ALARMS, UPDATE_ALARMS} from "../actions/types";

const initialState = {
  alarms: {},
}

export default function (state = initialState, action) {
  const {type, payload} = action

  let newAlarm = {};
  switch (type) {
    case LOAD_ALARMS:
      newAlarm[payload.deviceId] = payload.alarms
      return {
        ...state,
        alarms: {
          ...state.alarms,
          ...newAlarm
        }
      }

    case UPDATE_ALARMS:
      const payLoadAlarm = state.alarms[payload.deviceId] || []
      newAlarm[payload.deviceId] = [payload, ...payLoadAlarm]
      return {
        ...state,
        alarms: {
          ...state.alarms,
          ...newAlarm
        },
      }

    default:
      return state
  }
}
