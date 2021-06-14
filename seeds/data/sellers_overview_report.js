const moment = require('moment')
const { generateSellerOverviewReport } = require('../faker')

const getFakeData = async (amount) => {
  return Promise.all([...Array(amount).keys()].map(i => {
    const reference = moment().subtract(i, 'days').toDate()
    return generateSellerOverviewReport({ reference })
  }))
}

const data = async (production) => {
  const fakeData = (!production) ? await getFakeData(50) : []
  return [
    ...fakeData
  ]
}

module.exports = data
