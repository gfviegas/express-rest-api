const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

const jwtMiddleware = rfr('/helpers/jwt').middleware

// Get
router.get('/', controller.find)

// Create
router.post('/', [jwtMiddleware, validators.create, validators.uniqueKeyValidator], controller.create)

// Update
router.put('/', [jwtMiddleware], controller.update)

// Check if exists
router.post('/key', [jwtMiddleware, validators.keyCheck], controller.checkExists)

module.exports = router
