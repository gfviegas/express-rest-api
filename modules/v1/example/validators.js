const path = require('path')
const handleValidation = require(path.join(global._base, '/helpers/validation'))

const nameValidators = (req) => {
  req.checkBody('name', {error: 'required'}).notEmpty()
  req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
}
const emailValidators = (req) => {
  req.checkBody('email', {error: 'required'}).notEmpty()
  req.checkBody('email', {error: 'invalid'}).isEmail()
}

const userValidator = (req) => {
  nameValidators(req)
  emailValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    userValidator(req)
    handleValidation(req, res, next)
  },
  replace: (req, res, next) => {
    userValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    // To validate
  }
}
