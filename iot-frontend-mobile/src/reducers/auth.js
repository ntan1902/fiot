import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from '../actions/types'
import { getItem } from '../async-storage'

// const user = JSON.parse(getItem('user'))

const initialState = { isLoggedIn: false, user: null }

// const initialState = user
//   ? { isLoggedIn: true, user }
//   : { isLoggedIn: false, user: null }

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      }
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state
  }
}
