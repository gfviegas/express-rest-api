const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')
const Model = require('./model').model

const uniqueEmailValidator = (req, res, next) => {
  Model
    .findOne({email: req.body.email})
    .exec((err, value) => {
      if (err) throw err

      if (!value) return next()
      if (req.params.id && value._id.equals(req.params.id)) return next()
      const errorMessage = {
        email: {param: 'email', msg: {error: 'unique'}}
      }
      res.status(409).json(errorMessage)
      return false
    })
}

const uniqueUsernameValidator = (req, res, next) => {
  Model
    .findOne({username: req.body.username})
    .exec((err, value) => {
      if (err) throw err

      if (!value) return next()
      if (req.params.id && value._id.equals(req.params.id)) return next()
      const errorMessage = {
        username: {param: 'username', msg: {error: 'unique'}}
      }
      res.status(409).json(errorMessage)
      return false
    })
}

const nameValidators = (req) => {
  req.checkBody('name', {error: 'required'}).notEmpty()
  req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
}
const emailValidators = (req) => {
  req.checkBody('email', {error: 'required'}).notEmpty()
  req.checkBody('email', {error: 'invalid'}).isEmail()
}
const usernameValidators = (req) => {
  req.checkBody('username', {error: 'required'}).notEmpty()
  req.checkBody('username', {error: 'length', min: 4, max: 20}).len(4, 20)
}
const passwordValidators = (req) => {
  req.checkBody('password', {error: 'required'}).notEmpty()
  req.checkBody('password', {error: 'length', min: 6, max: 20}).len(6, 20)
}
const activeValidators = (req) => {
  req.checkBody('active', {error: 'required'}).notEmpty()
  req.checkBody('active', {error: 'invalid'}).isBoolean()
}

const userValidator = (req) => {
  nameValidators(req)
  passwordValidators(req)
  activeValidators(req)
  emailValidators(req)
  usernameValidators(req)
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
    if (req.body && req.body.name) req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
    if (req.body && req.body.email) req.checkBody('email', {error: 'invalid'}).isEmail()
    if (req.body && req.body.username) req.checkBody('username', {error: 'length', min: 4, max: 20}).len(4, 20)
    if (req.body && req.body.password) req.checkBody('password', {error: 'length', min: 6, max: 20}).len(6, 20)
    if (req.body && req.body.active) req.checkBody('active', {error: 'invalid'}).isBoolean()
    handleValidation(req, res, next)
  },
  email (req, res, next) {
    emailValidators(req)
    handleValidation(req, res, next)
  },
  username (req, res, next) {
    usernameValidators(req)
    handleValidation(req, res, next)
  },
  uniqueEmailValidator,
  uniqueUsernameValidator
}
