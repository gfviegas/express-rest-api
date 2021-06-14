const moment = require('./moment')

/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
const createQueryObject = (req) => {
  const reqQuery = Object.assign({}, req.query)
  if (reqQuery.hasOwnProperty('filter')) delete reqQuery.filter
  if (reqQuery.hasOwnProperty('page')) delete reqQuery.page
  if (reqQuery.hasOwnProperty('limit')) delete reqQuery.limit
  if (reqQuery.hasOwnProperty('sort')) delete reqQuery.sort
  return reqQuery
}

const parseSortParam = (sort) => {
  if (!sort) return null

  try {
    const data = JSON.parse(sort)
    return data
  } catch (e) {
    return sort
  }
}

const applyDateSanitizers = (query) => {
  let { created_at } = query

  if (!created_at) return query

  created_at = JSON.parse(created_at)
  if (created_at.$lte) {
    created_at.$lte = moment(created_at.$lte).endOf('day').toDate()
  }
  if (created_at.$gte) {
    created_at.$gte = moment(created_at.$gte).startOf('day').toDate()
  }

  return Object.assign(query, { created_at })
}

module.exports = {
  createQueryObject,
  parseSortParam,
  applyDateSanitizers
}
