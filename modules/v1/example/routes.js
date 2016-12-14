const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

// Create
router.post('/', validators.create, controller.create)

// Get
router.get('/', controller.find)

// Test custom controller method
router.get('/test', controller.test)

// Get by Id
router.get('/:id', controller.findById)

// Replace
router.put('/:id', validators.replace, controller.findOneAndUpdate)

// Update
router.patch('/:id', validators.update, controller.findOneAndUpdate)

// Delete
router.delete('/:id', controller.remove)

module.exports = router
