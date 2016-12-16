const mongoose = require('mongoose')
mongoose.Promise = global.Promise

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.DB_HOST_TEST)
} else {
  mongoose.connect(process.env.DB_HOST)
}

const db = mongoose.connection

db.on('error', (err) => {
  if (process.env.NODE_ENV === 'development') { console.log('DB connection error', err) }
})

db.on('open', () => {
  if (process.env.NODE_ENV === 'development') { console.log('DB connection open') }
})

db.on('connected', (err) => {
  if (err) throw err
  if (process.env.NODE_ENV === 'development') { console.log('DB connected successfully!') }
})

db.on('disconnected', (err) => {
  if (err) throw err
  if (process.env.NODE_ENV === 'development') { console.log('DB disconnected') }
})

module.exports = db
