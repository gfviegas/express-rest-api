require('dotenv').config()
const rfr = require('rfr')

rfr('/config/db')

// Import packages
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const busboyBodyParser = rfr('/helpers/body-parser')
const { errorHandler } = rfr('/helpers/error')
const cors = require('cors')
const validator = require('express-validator')
const timeout = require('express-timeout-handler')
const app = express()

const versions = ['v1']

rfr('/config/api_error')

global._base = path.join(__dirname, '/')

// Middlewares
app.use(timeout.handler({
  timeout: 10000,
  onTimeout: function (_req, res) {
    res.status(503).json({ error: 'timeout' })
  }
}))

if (app.get('env') === 'development') {
  // app.use(logger('dev'))
  app.get('/template', (req, res) => {
    res.render(`${req.query.path}`, JSON.parse(req.query.data))
  })
}
app.use(busboyBodyParser())
app.use(bodyParser.json({ limit: '42mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}))
app.use(validator())
app.use(express.static('public'))

// Set global response headers
app.use((_req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

// Apply the routes for each version setted
versions.forEach((version) => {
  const versionRoutesBackoffice = rfr('/modules/backoffice/' + version + '/routes')
  const versionRoutesSite = rfr('/modules/site/' + version + '/routes')
  app.use('/api/' + version + '/backoffice', versionRoutesBackoffice)
  app.use('/api/' + version + '/site', versionRoutesSite)
})

app.get('/', (req, res) => {
  res.status(200).json({ messsage: 'test ok' })
})

// Global error handler
app.use(errorHandler)

module.exports = app
