const {User, Role} = require('../models')
const {Op} = require("sequelize")
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (user) {
    res.status(StatusCodes.BAD_REQUEST).send({
      message: "Register fail! Email is already in use.",
      status: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString()
    })
    return
  }

  next()
}


const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail
}

module.exports = verifySignUp;
