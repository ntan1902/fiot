import {LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS} from "./types";
import {AuthService} from "../services";

export const register =
  (email, firstName, lastName, password) => async (dispatch) => {
    const data = await AuthService.register(email, firstName, lastName, password)
    if (data) {
      dispatch({
        type: REGISTER_SUCCESS,
      })
    }
    return data
  };

export const login = (email, password) => async (dispatch) => {
  const data = await AuthService.login(email, password);
  if (data) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: data },
    });
  }
  return data;
};

export const createPassword = (activateToken, password) => async (dispatch) => {
  const data = await AuthService.createPassword(activateToken, password);
  if (data) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: data },
    });
  }
  return data;
};

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};
