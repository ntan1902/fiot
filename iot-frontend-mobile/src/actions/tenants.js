import { TenantService } from '../services'
import {
  CREATE_TENANT,
  LOAD_TENANTS,
  REMOVE_TENANT,
  UPDATE_TENANT,
} from './types'

export const loadTenants = () => async (dispatch) => {
  const data = await TenantService.getAll()
  if (data) {
    dispatch({
      type: LOAD_TENANTS,
      payload: data,
    })
  }
  return data
}

export const createTenant = (newTenant) => (dispatch) => {
  dispatch({
    type: CREATE_TENANT,
    payload: newTenant,
  })
}

export const updateTenant = (updatedTenant) => (dispatch) => {
  dispatch({
    type: UPDATE_TENANT,
    payload: updatedTenant,
  })
}

export const removeTenant = (tenantId) => (dispatch) => {
  dispatch({
    type: REMOVE_TENANT,
    payload: tenantId,
  })
}
