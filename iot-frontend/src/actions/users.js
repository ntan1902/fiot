import {UserService} from "../services";
import {
  LOAD_USERS,
} from "./types";

export const loadUsers = (userId) => async (dispatch) => {
  const data = await UserService.getAll(userId);
  if (data) {
    dispatch({
      type: LOAD_USERS,
      payload: data.users,
    });
  }
  return data;
};
