require('dotenv').config()
const rfr = require('rfr')
const seeder = require('./seeder')

const chalk = require('chalk')
const error = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue

const seedSetup = () => {
  console.log(info('\n**** Seeding Setup... ****\n'))
  const model = rfr('modules/v1/setup/model').model
  const data = require('./setup')

  return seeder.clearAndSeed(model, data)
}

const seedUsers = () => {
  console.log(info('\n**** Seeding Users... ****\n'))
  const model = rfr('modules/v1/user/model').model
  const data = require('./user')

  return seeder.clearAndSeed(model, data)
}

const execute = () => {
  const funcs = [seedSetup(), seedUsers()]
  return Promise.all(funcs)
}

seeder.connect().then(() => {
  console.log(success('**** DB connected sucessfully **** \n'))
  execute()
    .then(response => {
      let count = 0
      response.forEach(() => count++)
      console.log(success(`\n ### All Seeds done!  ### \n`))
      console.log(success(`\n ### ${count} seeds ran!  ### \n`))
      process.exit(0)
    })
    .catch(err => {
      console.log(error(err))
      process.exit(1)
    })
}).catch((err) => {
  console.log(error(err))
  process.exit(1)
})
