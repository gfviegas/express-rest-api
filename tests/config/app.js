const rfr = require('rfr')
process.env.NODE_ENV = 'test'
const app = rfr('./index')
module.exports = app
