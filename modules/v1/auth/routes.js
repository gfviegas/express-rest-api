const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// Get user by JWT
router.get('/', [jwtMiddleware], controller.fetch)

// Create JWT
router.post('/', validators.create, controller.authenticate)

// Set password reset token and send reset password email
router.post('/reset', validators.reset, controller.resetPassword)

// Get by Passwork Token
router.get('/passwordtoken/:token', [], controller.findByPasswordToken)

// Update the user password
router.patch('/:token/password', validators.updatePassword, controller.updatePassword)

module.exports = router
