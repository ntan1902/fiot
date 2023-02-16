import { WidgetsBundleService } from '../services'
import {
  CREATE_WIDGETS_BUNDLE,
  LOAD_WIDGETS_BUNDLES,
  REMOVE_WIDGETS_BUNDLE,
  UPDATE_WIDGETS_BUNDLE,
} from './types'

export const loadWidgetsBundles = () => async (dispatch) => {
  const data = await WidgetsBundleService.getAll()
  if (data) {
    dispatch({
      type: LOAD_WIDGETS_BUNDLES,
      payload: data,
    })
  }
  return data
}

export const createWidgetsBundle = (newWidgetsBundle) => (dispatch) => {
  dispatch({
    type: CREATE_WIDGETS_BUNDLE,
    payload: newWidgetsBundle,
  })
}

export const updateWidgetsBundle = (updatedWidgetsBundle) => (dispatch) => {
  dispatch({
    type: UPDATE_WIDGETS_BUNDLE,
    payload: updatedWidgetsBundle,
  })
}

export const removeWidgetsBundle = (widgetsBundleId) => (dispatch) => {
  dispatch({
    type: REMOVE_WIDGETS_BUNDLE,
    payload: widgetsBundleId,
  })
}
