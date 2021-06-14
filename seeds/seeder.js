const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const connect = () => {
  if (mongoose.connection.readyState) return

  const { NODE_ENV, DB_HOST_TEST, DB_HOST } = process.env
  return (NODE_ENV === 'test') ? mongoose.connect(DB_HOST_TEST) : mongoose.connect(DB_HOST)
}

const insert = async (Model, data) => {
  try {
    const result = await Model.create(data)
    return (result) ? 'inserted' : 'skipped'
  } catch (e) {
    console.error(e)
    return 'skipped'
  }
}

const seed = async (Model, data, options) => {
  options = Object.assign({ drop: false }, options)

  if (options.drop) await Model.deleteMany({})
  if (!data) throw new Error(`No data provided for ${Model}.`)

  const insertions = data.map(data => insert(Model, data))
  const response = await Promise.all(insertions)
  const inserted = response.reduce((n, r) => n + (r === 'inserted'), 0)
  const skipped = response.reduce((n, r) => n + (r === 'skipped'), 0)

  return { inserted, skipped }
}

module.exports = {
  connect,
  seed
}
