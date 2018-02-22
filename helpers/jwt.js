const jwt = require('jsonwebtoken')

const getTokenFromRequest = (req) => {
  const authorization = req.header('authorization')
  if (!authorization) { return false }
  return authorization.split(' ')[1] // Bearer
}

const getPayload = (req) => {
  const token = getTokenFromRequest(req)
  return jwt.decode(token)
}

const getUserId = (req) => {
  const data = getPayload(req)
  return data.sub
}

const generateToken = (user) => {
  const payload = {
    sub: user.id,
    data: {
      name: user.name
    }
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, process.env.APP_SECRET, options)
}

const middleware = (req, res, next) => {
  const token = getTokenFromRequest(req)
  if (token && token.length > 0) {
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(403).json({error: 'token_expired'})
        } else {
          res.status(401).json({error: err.message.split(' ').join('_').toLowerCase()})
        }
        return false
      }
      next()
    })
  } else {
    res.status(401).json({error: 'no_token'})
    return false
  }
}

module.exports = {
  getPayload,
  getUserId,
  getTokenFromRequest,
  generateToken,
  middleware
}
