const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST)
const db = mongoose.connection

db.on('error', (err) => {
  console.log('DB connection error', err)
})

db.on('open', () => {
  console.log('DB connection open')
})

db.on('connected', (err) => {
  if (err) throw err
  console.log('DB connected successfully!')
})

db.on('disconnected', (err) => {
  if (err) throw err
  console.log('DB disconnected')
})

module.exports = db
