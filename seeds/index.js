require('dotenv').config()
const rfr = require('rfr')
const seeder = require('./seeder')

const chalk = require('chalk')
const error = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue
const warning = chalk.bold.yellow

const availableSeeds = ['backoffice_role', 'backoffice_user', 'process_average_time', 'checkpoint', 'sellers_overview_report']
const options = { production: false, drop: false }

const seedResource = async (resource) => {
  const resourceLabel = resource[0].toUpperCase() + resource.substring(1)
  console.log(info(`\n**** Seeding ${resourceLabel}... ****`))
  const Model = rfr(`models/${resource}`).model

  const data = await require(`./data/${resource}`)(options.production)
  if (!data) throw new Error(`No data provided for ${Model}.`)

  const { inserted, skipped } = await seeder.seed(Model, data, options)
  console.log(warning(`**** ${inserted} inserted, ${skipped} skipped. ****\n`))
  return inserted
}
const execute = async (resources) => {
  const tasks = resources.map(r => async () => seedResource(r))

  const results = await tasks.reduce(async (promiseChain, currentTask) => {
    const chainResults = await promiseChain
    const currentResult = await currentTask()
    return [...chainResults, currentResult]
  }, Promise.resolve([]))

  return Promise.all(results)
}

// Connect and run seeds
const connectAndRun = async (args) => {
  try {
    await seeder.connect()
    console.log(success('**** DB connected sucessfully **** \n'))

    if (args.includes('--drop')) {
      options.drop = true
      console.log(warning('\tDropping all the specified models from database..'))
    }
    if (args.includes('--production')) {
      options.production = true
      console.log(warning('\tSeeding production data only..'))
    }

    const resources = (args.includes('all')) ? [...availableSeeds] : args.filter(r => availableSeeds.includes(r))
    if (!resources || !resources.length) {
      console.log(error('\n ### No seed found matching the arguments!  ### \n'))
      throw new Error('no_seed')
    }

    const response = await execute(resources)

    console.log(success('\n ### All Seeds done!  ### \n'))
    console.log(success(`\n ### ${response.length} seeds ran!  ### \n`))

    return 0
  } catch (e) {
    console.error(e)
    console.log(error(e))
    return process.exit(1)
  }
}

const runDirect = async () => {
  const args = process.argv.slice(2)
  const code = await connectAndRun(args)
  process.exit(code)
}

if (require.main === module) {
  runDirect()
}

exports.connectAndRun = connectAndRun
