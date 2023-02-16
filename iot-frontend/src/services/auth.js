import {AuthApi} from "../api";
import {setItem} from "../local-storage";

const register = (email, firstName, lastName, password) => {
  return AuthApi.register({
    email,
    firstName,
    lastName,
    password,
  });
};

const login = async (email, password) => {
  const response = await AuthApi.login({
    email,
    password,
  });
  if (response.accessToken && response.refreshToken) {
    setItem("accessToken", response.accessToken);
    setItem("refreshToken", response.refreshToken);
  }
  return response.user;
};

const changePassword = (currentPassword, newPassword) => {
  return AuthApi.changePassword({
    currentPassword,
    newPassword,
  })
    .then((response) => {
      return response;
    })
    .catch((err) => err);
};

const createPassword = (activateToken, password) => {
  return AuthApi.activateUser({
    activateToken,
    password,
  })
      .then((response) => {
        setItem("accessToken", response.accessToken);
        setItem("refreshToken", response.refreshToken);
        return response.user;
      })
      .catch((err) => err);
};

const logout = () => {
  localStorage.clear();
};

export default {
  register,
  login,
  changePassword,
  createPassword,
  logout,
};
