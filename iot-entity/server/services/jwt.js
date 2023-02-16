const fs = require('fs')
const jwt = require('jsonwebtoken')

const publicKEY = fs.readFileSync('./public.key', 'utf-8')

module.exports = {
  sign: (payload, $Options) => {
    // Token signing options
    const signOptions = {
      issuer: $Options.issuer,
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: process.env.JWT_ALGORITHM
    }

    return jwt.sign(payload, privateKEY, signOptions)
  },

  verify: (token, $Options) => {
    const verifyOptions = {
      issuer: $Options.issuer,
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: [process.env.JWT_ALGORITHM]
    }

    try {
      return jwt.verify(token, publicKEY, verifyOptions)
    }
    catch (err) {
      console.log(err)
      return false
    }
  },

  decode: (token) => {
    return jwt.decode(token, {complete: true})
    // will return null if token is invalid
  }

}
