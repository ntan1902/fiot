import constants from "./constants"
import {getItem} from "../local-storage";

export default function() {
  const accessToken = JSON.parse(getItem('accessToken'));
  console.log('accessToken', accessToken);
  // return authorization header if user login with accessToken else return empty object
  if (accessToken) {
      return {[constants.TOKEN_HEADER]: constants.TOKEN_START + accessToken};
  } else {
      return {};
  }
}