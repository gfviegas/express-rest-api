const { getUserId } = require('./jwt')

module.exports = (Model, field, matchCurrentUser = false) => {
  return async (req, res, next) => {
    const query = {}
    query[field] = req.body[field]

    const value = await Model.findOne(query)
    const localId = (matchCurrentUser) ? (req.params.id || getUserId(req)) : req.params.id

    if (!value) return next()
    if (localId && value._id.equals(localId)) return next()

    const errorMessage = {}
    errorMessage[field] = 'unique'

    return next(new APIError(errorMessage, 409))
  }
}
