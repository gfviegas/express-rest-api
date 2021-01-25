const rfr = require('rfr')
require('dotenv').config()

process.env.NODE_ENV = 'test'
rfr('config/db')
