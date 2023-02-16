import { DashboardService } from '../services'
import {
  CREATE_DASHBOARD,
  LOAD_DASHBOARDS,
  OPEN_DASHBOARD,
  REMOVE_DASHBOARD,
  SAVE_CHANGES_DASHBOARD,
  UPDATE_DASHBOARD,
} from './types'

export const loadDashboards = () => async (dispatch) => {
  const data = await DashboardService.getAll()
  if (data) {
    dispatch({
      type: LOAD_DASHBOARDS,
      payload: data,
    })
  }
  return data
}

export const createDashboard = (newDashboard) => (dispatch) => {
  dispatch({
    type: CREATE_DASHBOARD,
    payload: newDashboard,
  })
}

export const updateDashboard = (updatedDashboard) => (dispatch) => {
  dispatch({
    type: UPDATE_DASHBOARD,
    payload: updatedDashboard,
  })
}

export const removeDashboard = (dashboardId) => (dispatch) => {
  dispatch({
    type: REMOVE_DASHBOARD,
    payload: dashboardId,
  })
}

export const openDashboard =
  ({ isOpen, dashboard }) =>
  async (dispatch) => {
    dispatch({
      type: OPEN_DASHBOARD,
      payload: {
        isOpen,
        dashboard,
      },
    })
  }

export const saveChangesDashboard = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_CHANGES_DASHBOARD,
    payload: data,
  })
}
