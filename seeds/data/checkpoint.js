const moment = require('moment')
const { generateCheckpoint } = require('../faker')

const getFakeData = async (amount) => {
  return Promise.all([...Array(amount).keys()].map(i => {
    // eslint-disable-next-line camelcase
    const created_at = moment().subtract(30 - i, 'days').toDate()
    const eventDate = moment().add(30 - i + Math.round(Math.random() * 10), 'days').toDate()
    return generateCheckpoint({ created_at }, eventDate)
  }))
}

const data = async (production) => {
  const fakeData = (!production) ? await getFakeData(40) : []
  return [
    ...fakeData
  ]
}

module.exports = data
