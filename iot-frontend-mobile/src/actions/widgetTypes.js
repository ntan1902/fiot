import { WidgetTypeService } from '../services'
import { LOAD_WIDGET_TYPES } from './types'

export const loadWidgetTypes = () => async (dispatch) => {
  const data = await WidgetTypeService.getAll()
  if (data) {
    dispatch({
      type: LOAD_WIDGET_TYPES,
      payload: data,
    })
  }
  return data
}
