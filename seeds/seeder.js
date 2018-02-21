const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const connect = () => {
  return mongoose.connect(process.env.DB_HOST)
}

const clearModel = (Model, cb) => {
  return Model.remove(cb)
}

const clearAndSeed = (Model, data) => {
  return new Promise((resolve, reject) => {
    Model.remove(err => {
      if (err) throw err
      Model.create(data).then(data => resolve(data)).catch(data => reject(data))
    })
  })
}

const seed = (Model, data) => {
  return Model.create(data)
}

module.exports = {
  connect,
  clearModel,
  clearAndSeed,
  seed
}
