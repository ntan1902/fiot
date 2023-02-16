import {
  CREATE_DASHBOARD,
  LOAD_DASHBOARDS,
  OPEN_DASHBOARD,
  REMOVE_DASHBOARD,
  SAVE_CHANGES_DASHBOARD,
  UPDATE_DASHBOARD,
} from '../actions/types'

const initialState = {
  dashboards: [],
  openedDashboard: {
    isOpen: false,
    dashboard: {},
  },
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case LOAD_DASHBOARDS:
      return {
        ...state,
        dashboards: payload,
      }

    case CREATE_DASHBOARD:
      return {
        ...state,
        dashboards: [...state.dashboards, payload],
      }

    case UPDATE_DASHBOARD:
      return {
        ...state,
        dashboards: state.dashboards.map((dashboard) => {
          if (dashboard.id === payload.id) {
            return {
              ...dashboard,
              ...payload,
            }
          }
          return dashboard
        }),
      }

    case REMOVE_DASHBOARD:
      return {
        ...state,
        dashboards: state.dashboards.filter(
          (dashboard) => dashboard.id !== payload
        ),
      }

    case OPEN_DASHBOARD:
      return {
        ...state,
        openedDashboard: payload,
      }

    case SAVE_CHANGES_DASHBOARD:
      return {
        ...state,
        dashboards: state.dashboards.map((dashboard) => {
          if (dashboard.id === payload.dashboardId) {
            return {
              ...dashboard,
              configuration: {
                ...dashboard.configuration,
                widgets: payload.widgets,
              },
            }
          }
          return dashboard
        }),
        openedDashboard: {
          ...state.openedDashboard,
          dashboard: {
            ...state.openedDashboard.dashboard,
            configuration: {
              ...state.openedDashboard.dashboard.configuration,
              widgets: payload.widgets,
            },
          },
        },
      }

    default:
      return state
  }
}
