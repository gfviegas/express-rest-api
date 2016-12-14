const router = require('express').Router()

router.get('/test', (req, res) => {
  res.json({message: 'v1 working!'})
})

/**
 * Use the modules routes. It's safer doing in a separate file than magically, to
 * be sure nester routes will be applied correctly.
 */
router.use('/example', require('./example/routes'))

// Return router
module.exports = router
