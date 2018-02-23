const rfr = require('rfr')
const mongoose = require('mongoose')
const logger = rfr('helpers/logger')
require('./chai')()

process.env.NODE_ENV = 'test'
const app = rfr('./index')

const dropDB = async () => {
  if (mongoose.connection.name !== process.env.DB_HOST_TEST.split('/')[3]) {
    logger.error(`[CRITICAL] - Not running in test environment DB!`)
    logger.error(`${mongoose.connection.name} !== ${process.env.DB_HOST_TEST.split('/')[3]}`)
    logger.error(`${JSON.stringify(mongoose.connection.hosts)}`)

    return process.exit(1)
  }

  logger.info(`[INFO] - Dropping the DB...`)
  mongoose.connection.dropDatabase()
  logger.info(`[INFO] - DB Dropped! \n`)
}

before(async () => {
  const res = await dropDB()
  if (res) logger.info(res)
})

module.exports = app
