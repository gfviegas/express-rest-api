const handleValidation = async (req, res, next) => {
  const result = await req.getValidationResult()

  if (result.isEmpty()) return next()
  const errors = result.mapped()
  return next(new APIError(errors, 422))
}

module.exports = handleValidation
