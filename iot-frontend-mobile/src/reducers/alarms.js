import { LOAD_ALARMS, UPDATE_ALARMS } from '../actions/types'

const initialState = {
  alarms: {},
}

export default function (state = initialState, action) {
  const { type, payload } = action

  const newAlarm = {}
  switch (type) {
    case LOAD_ALARMS:
      newAlarm[payload.deviceId] = payload.alarms
      return {
        ...state,
        alarms: {
          ...state.alarms,
          ...newAlarm,
        },
      }

    case UPDATE_ALARMS:
      newAlarm[payload.deviceId] = [payload, ...state.alarms[payload.deviceId]]
      return {
        ...state,
        alarms: {
          ...state.alarms,
          ...newAlarm,
        },
      }

    default:
      return state
  }
}
