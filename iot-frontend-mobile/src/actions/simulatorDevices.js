import { SimulatorDeviceService } from '../services'
import {
  CREATE_SIMULATOR_DEVICE,
  LOAD_SIMULATOR_DEVICES,
  REMOVE_SIMULATOR_DEVICE,
  UPDATE_SIMULATOR_DEVICE,
} from './types'

export const loadSimulatorDevices = () => async (dispatch) => {
  const data = await SimulatorDeviceService.getAll()
  if (data) {
    dispatch({
      type: LOAD_SIMULATOR_DEVICES,
      payload: data,
    })
  }
  return data
}

export const createSimulatorDevice = (newSimulatorDevice) => (dispatch) => {
  dispatch({
    type: CREATE_SIMULATOR_DEVICE,
    payload: newSimulatorDevice,
  })
}

export const updateSimulatorDevice = (updatedSimulatorDevice) => (dispatch) => {
  dispatch({
    type: UPDATE_SIMULATOR_DEVICE,
    payload: updatedSimulatorDevice,
  })
}

export const removeSimulatorDevice = (simulatorDeviceId) => (dispatch) => {
  dispatch({
    type: REMOVE_SIMULATOR_DEVICE,
    payload: simulatorDeviceId,
  })
}
