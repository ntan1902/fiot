const validate = require("validate.js");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const { AUTHORITIES } = require("../helpers/constant");
const constant = require("../helpers/constant");
const DeviceCredentialsService = require("../services/deviceCredentials");
const DeviceDAO = require("../dao/device");

const constraint = {
  email: {
    presence: true,
    email: true,
  },

  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters",
    },
  },

  confirmPassword: {
    equality: "password", // this field need to equal to 'password'
  },

  username: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 3 characters",
    },
    format: {
      pattern: "[a-z0-9]+", // Allow only a-z and 0-9
      flags: "i", // Allow upper/lowercase,
      message: "Username can only contain a-z and 0-9",
    },
  },
};

validateField = (field) => {
  return (req, res, next) => {
    const error = validate.single(req.body[field], constraint[field]);
    if (!error) {
      next();
      return;
    }
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: req.body[field] + " " + error });
  };
};

checkCredentialsTypes = (credentialsType) => {
  const validTypes = [
    constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN,
    constant.DEVICE_CREDENTIALS_TYPE_X_509,
    constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC,
  ];

  if (!validTypes.includes(credentialsType)) {
    return false;
  }

  return true;
};

validateAuthorities = async (req, res, next) => {
  const authorities = req.body.authorities;

  if (authorities.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: authorities + " is empty" });
    return;
  }

  for (let i = 0; i < authorities.length; i++) {
    let authority = authorities[i];

    if (AUTHORITIES.find((auth) => auth === authority) === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: authorities + " is invalid" });
      return;
    }
  }
  next();
};

validateDeviceDetails = async (req, res, next) => {
  const { name } = req.body;

  // Case update device
  if (req.params.deviceId) {
    const existedOtherDeviceName = await DeviceDAO.getByNameExcludeOwnId(
      name,
      req.params.deviceId
    );
    console.log('existedOtherDeviceName', existedOtherDeviceName);
    if (existedOtherDeviceName) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: `Device name: ${name} is already existed` });
      return;
    }

    next();
  }
  else {
    const existedDeviceName = await DeviceDAO.getByName(name);
    if (existedDeviceName) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: `Device name: ${name} is already existed` });
      return;
    }
    next();
  }
};

validateDeviceCredentials = async (req, res, next) => {
  const { credentialsType, credentialsValue } = req.body;

  if (!credentialsType) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Credentials type is empty" });
    return;
  }

  if (!checkCredentialsTypes(credentialsType)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: `Credentials type: ${credentialsType} is invalid` });
    return;
  }

  if (credentialsType !== constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
    if (!credentialsValue) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Credentials value is empty" });
      return;
    }
  }

  let _credentialsValue
  if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
    _credentialsValue = credentialsValue.accessToken
  }
  if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
    _credentialsValue = credentialsValue.RSAPublicKey
  }
  if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
    _credentialsValue = {
      clientId: credentialsValue.clientId,
      username: credentialsValue.username,
      password: credentialsValue.password
    }
  }

  // Case update device
  if (req.params.deviceId) {
    const existedOtherDeviceCredentialsId =
      await DeviceCredentialsService.validateToken(
        _credentialsValue,
        credentialsType,
        req.params.deviceId
      );

    if (existedOtherDeviceCredentialsId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Credentials value has already existed" });
      return;
    }
    next();
    return;
  } 
  else {
    const existedCredentials = await DeviceCredentialsService.validateToken(
      _credentialsValue,
      credentialsType
    );
    if (existedCredentials) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Credentials value has already existed" });
      return;
    }
    next();
  }
};

validateDeviceToken = (req, res, next) => {
  const { token, type } = req.body;
  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "Empty token!" });
    return;
  }

  if (!checkCredentialsTypes(type)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: `Credentials type: ${type} is invalid` });
    return;
  }

  next();
};

const validator = {
  validateField: validateField,
  validateAuthorities: validateAuthorities,
  validateDeviceDetails: validateDeviceDetails,
  validateDeviceCredentials: validateDeviceCredentials,
  validateDeviceToken: validateDeviceToken,
};

module.exports = validator;
