import {CREATE_SIMULATOR_DEVICE, LOAD_SIMULATOR_DEVICES, REMOVE_SIMULATOR_DEVICE, UPDATE_SIMULATOR_DEVICE} from "../actions/types"

const initialState = {
  simulatorDevices: [],
}

export default function (state = initialState, action) {
  const {type, payload} = action

  switch (type) {
    case LOAD_SIMULATOR_DEVICES:
      return {
        ...state,
        simulatorDevices: payload,
      }

    case CREATE_SIMULATOR_DEVICE:
      return {
        ...state,
        simulatorDevices: [...state.simulatorDevices, payload],
      }

    case UPDATE_SIMULATOR_DEVICE:
      return {
        ...state,
        simulatorDevices: state.simulatorDevices.map((device) => {
          if (device.id === payload.id) {
            const updatedDevice = {
              ...device,
              ...payload,
            }
            return updatedDevice
          }
          return device
        }),
      }

    case REMOVE_SIMULATOR_DEVICE:
      return {
        ...state,
        simulatorDevices: state.simulatorDevices.filter((device) => device.id !== payload),
      }

    default:
      return state
  }
}
