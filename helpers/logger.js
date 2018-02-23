const chalk = require('chalk')

const info = (msg) => { console.log(chalk.bold.blue(msg)) }
const error = (msg) => { console.log(chalk.bold.red(msg)) }
const success = (msg) => { console.log(chalk.bold.blue(msg)) }

module.exports = {
  info,
  success,
  error
}
