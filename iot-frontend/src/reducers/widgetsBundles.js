import {
  CREATE_WIDGETS_BUNDLE,
  LOAD_WIDGETS_BUNDLES,
  REMOVE_WIDGETS_BUNDLE,
  UPDATE_WIDGETS_BUNDLE,
} from "../actions/types";

const initialState = {
  widgetsBundles: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_WIDGETS_BUNDLES:
      return {
        ...state,
        widgetsBundles: payload,
      };

    case CREATE_WIDGETS_BUNDLE:
      return {
        ...state,
        widgetsBundles: [...state.widgetsBundles, payload],
      };

    case UPDATE_WIDGETS_BUNDLE:
      return {
        ...state,
        widgetsBundles: state.widgetsBundles.map((widgetsBundle) => {
          if (widgetsBundle.id === payload.id) {
            const updatedWidgetsBundle = {
              ...widgetsBundle,
              ...payload,
            };
            return updatedWidgetsBundle;
          }
          return widgetsBundle;
        }),
      };

    case REMOVE_WIDGETS_BUNDLE:
      return {
        ...state,
        widgetsBundles: state.widgetsBundles.filter(
          (widgetsBundle) => widgetsBundle.id !== payload
        ),
      };

    default:
      return state;
  }
}
