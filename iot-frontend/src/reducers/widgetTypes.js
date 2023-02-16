import {LOAD_WIDGET_TYPES} from "../actions/types";

const initialState = {
  widgetTypes: []
}

export default function (state = initialState, action) {
  const {type, payload} = action

  switch (type) {
    case LOAD_WIDGET_TYPES:
      return {
        ...state,
        widgetTypes: payload
      }

    default:
      return state
  }
}
