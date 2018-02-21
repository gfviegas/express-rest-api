const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')
const Model = require('./model').model

const uniqueKeyValidator = (req, res, next) => {
  Model
    .findOne({data: {$elemMatch: {key: req.body.key}}})
    .exec((err, modelInstance) => {
      if (err) throw err

      if (!modelInstance) {
        next()
      } else {
        const errorMessage = {
          'key': {
            param: 'key',
            msg: {
              error: 'unique'
            }
          }
        }
        res.status(409).json(errorMessage)
        return false
      }
    })
}

const labelValidators = (req) => {
  req.checkBody('label', {error: 'required'}).notEmpty()
  req.checkBody('label', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const keyValidators = (req) => {
  req.checkBody('key', {error: 'required'}).notEmpty()
  req.checkBody('key', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const valueValidators = (req) => {
  req.checkBody('value', {error: 'required'}).notEmpty()
  req.checkBody('value', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const setupValidator = (req) => {
  labelValidators(req)
  keyValidators(req)
  valueValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    setupValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    // req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
    // req.checkBody('email', {error: 'invalid'}).isEmail()
  },
  keyCheck: (req, res, next) => {
    keyValidators(req)
    handleValidation(req, res, next)
  },
  uniqueKeyValidator
}
