import { DeviceService } from '../services'
import {
  CREATE_DEVICE,
  LOAD_DEVICES,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
} from './types'

export const loadDevices = () => async (dispatch) => {
  const data = await DeviceService.getAll()
  console.log('Loading devices: ', data)
  if (data) {
    dispatch({
      type: LOAD_DEVICES,
      payload: data,
    })
  }
  return data
}

export const createDevice = (newDevice) => (dispatch) => {
  dispatch({
    type: CREATE_DEVICE,
    payload: newDevice,
  })
}

export const updateDevice = (updatedDevice) => (dispatch) => {
  dispatch({
    type: UPDATE_DEVICE,
    payload: updatedDevice,
  })
}

export const removeDevice = (deviceId) => (dispatch) => {
  dispatch({
    type: REMOVE_DEVICE,
    payload: deviceId,
  })
}
