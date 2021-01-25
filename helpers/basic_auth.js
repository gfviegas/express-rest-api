const BASIC_TOKEN = process.env.BASIC_TOKEN

const getTokenFromRequest = (req) => {
  const authorization = req.header('authorization')
  if (!authorization) { return false }
  return authorization.split(' ')[1] // Basic
}

const middleware = (req, res, next) => {
  const token = getTokenFromRequest(req)
  if (token && token.length > 0) {
    if (token !== BASIC_TOKEN) {
      res.status(403).json({ error: 'invalid_token' })
      return false
    }
    next()
  } else {
    res.status(401).json({ error: 'no_token' })
    return false
  }
}

module.exports = {
  getTokenFromRequest,
  middleware
}
