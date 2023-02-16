const constants = require("../helpers/constant")

module.exports = function authHeader(token) {
  return {[constants.TOKEN_HEADER] : constants.TOKEN_START + token};
}