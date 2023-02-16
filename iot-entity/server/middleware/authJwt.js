const jwtService = require('../services/jwt')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const constant = require('../helpers/constant')
const CustomerDAO = require('../dao/customer')
const TenantDAO = require('../dao/tenant')

checkRoleExist = (userRoles, checkRole) => {
  let isCheck = false
  if (!userRoles) {
    return false
  }
  userRoles.forEach(role => {
    if (role === checkRole) {
      isCheck = true
    }
  })

  return isCheck
}

verifyToken = async (req, res, next) => {
  let token = req.headers[constant.TOKEN_HEADER.toLowerCase()]
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "No token provided!"
    })
  }

  if (token.startsWith(constant.TOKEN_START)) {
    token = token.substring(constant.TOKEN_START.length, token.length);
  } else {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "Wrong token type provided!"
    })
  }

  const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
  }
  const legit = jwtService.verify(token, verifyOptions)
  if (!legit) {
    return res.status(StatusCodes.UNAUTHORIZED).send(
        {message: "Unauthorized!"});
  }

  const {sub, authorities, tenantId} = jwtService.decode(token).payload
  if (!sub || !authorities) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "Missing attribute sub or authorities from token!"
    })
  }

  let isAdmin = false
  if (checkRoleExist(authorities, constant.ROLE_ADMIN)) {
    isAdmin = true
  }

  if (checkRoleExist(authorities, constant.ROLE_TENANT)) {
    req.tenantId = tenantId;
  }

  req.isAdmin = isAdmin
  req.userId = sub
  req.authorities = authorities
  req.token = token

  next()
}

isAdmin = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, constant.ROLE_ADMIN)
  isValid
      ? next()
      : res.status(StatusCodes.FORBIDDEN).send({message: "Require Admin role!"})
}

isTenantOrAdmin = async (req, res, next) => {
  let isValid =
      checkRoleExist(req.authorities, constant.ROLE_ADMIN) ||
      checkRoleExist(req.authorities, constant.ROLE_TENANT)

  isValid
      ? next()
      : res.status(StatusCodes.FORBIDDEN).send(
          {message: "Require Tenant Or Admin role!"})
}

isTenantOrCustomer = async (req, res, next) => {
  let isValid =
      checkRoleExist(req.authorities, constant.ROLE_CUSTOMER) ||
      checkRoleExist(req.authorities, constant.ROLE_TENANT)

  isValid
      ? next()
      : res.status(StatusCodes.FORBIDDEN).send(
          {message: "Require Tenant Or Customer role!"})
}

isCustomer = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, constant.ROLE_CUSTOMER)

  isValid
      ? next()
      : res.status(StatusCodes.FORBIDDEN).send(
          {message: "Require Customer role!"})
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isTenantOrAdmin: isTenantOrAdmin,
  isTenantOrCustomer: isTenantOrCustomer,
  isCustomer: isCustomer
}

module.exports = authJwt;
