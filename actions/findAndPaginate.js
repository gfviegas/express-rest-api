const rfr = require('rfr')
const { createQueryObject, parseSortParam } = rfr('helpers/request')

module.exports = (Model) => {
  return async (req, res) => {
    const { filter } = res.locals

    const query = filter || createQueryObject(req)

    const pagOptions = {
      page: (Number.parseInt(req.query.page) - 1) || 0,
      limit: Number.parseInt(req.query.limit) || 15,
      sort: parseSortParam(req.query.sort) || { created_at: 'desc' }
    }

    const count = await Model.find(query).count()
    const meta = {
      currentPage: (pagOptions.page + 1),
      limit: pagOptions.limit,
      totalPages: Math.ceil(count / pagOptions.limit),
      count
    }
    const resources = await Model.find(query)
      .skip(pagOptions.page * pagOptions.limit)
      .limit(pagOptions.limit)
      .sort(pagOptions.sort)
      .collation({ locale: 'pt', numericOrdering: true })

    const response = { resources, meta }
    return res.status(200).json(response)
  }
}
