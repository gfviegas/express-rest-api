module.exports = (model) => {
  return (req, res) => {
    const query = {}
    const pagOptions = {
      page: (req.query.page - 1) || 0,
      limit: req.query.limit || 15
    }

    const operation = model.find(query)
    const meta = {
      meta: {
        currentPage: pagOptions.page,
        limit: pagOptions.limit,
        totalPages: Math.ceil(operation.count() / pagOptions.limit)
      }
    }

    operation
      .sort({'created_at': '-1'})
      .skip(pagOptions.page * pagOptions.limit)
      .limit(pagOptions.limit)
      .exec((err, data) => {
        if (err) throw err

        const response = Object.assign(data, meta)
        res.status(200).json(response)
      })
  }
}
