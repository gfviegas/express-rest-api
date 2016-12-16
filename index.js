// Load environment vars and DB
require('dotenv').config()
require('./config/db')

// Import packages
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const validator = require('express-validator')
const app = express()
const server = require('./config/server')
const versions = ['v1']

global._base = path.join(__dirname, '/')

// Middlewares
if (app.get('env') === 'development') {
  app.use(logger('dev'))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(validator())

// Set global response headers
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

// Apply the routes for each version setted
versions.forEach((version) => {
  const versionRoutes = require('./modules/' + version + '/routes')
  app.use('/api/' + version, versionRoutes)
})

// Start server
server.start(app)

module.exports = app
