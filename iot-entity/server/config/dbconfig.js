require('dotenv').config();
const constants = require('../helpers/constant')

module.exports = {
  "development": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,
    "dialect": constants.DATABASE_DIALECT,
    "timezone": "+7:00",
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
  },
  "test": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,
    "dialect": constants.DATABASE_DIALECT,
    "timezone": "+7:00",
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
  },
  "production": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,
    "dialect": constants.DATABASE_DIALECT,
    "timezone": "+7:00",
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
  }
}
