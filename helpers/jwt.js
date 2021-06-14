const jwt = require('jsonwebtoken')
const BACKOFFICE_AUD_TARGET = 'BACKOFFICE'

const { APP_SECRET } = process.env

/**
 * Extracts the JWT in authorization header
 */
const getTokenFromRequest = (req) => {
  const authorization = req.header('authorization')
  if (!authorization) { return false }
  return authorization.split(' ')[1] // Bearer
}

/**
 * Extracts the user data on the JWT in authorization header
 */
const getPayload = (req) => {
  const token = getTokenFromRequest(req)
  return jwt.decode(token)
}

/**
 * Extracts the user id on the JWT in authorization header
 */
const getUserId = (req) => {
  const data = getPayload(req)
  return data.sub
}

const generateToken = (user, isBackofficeUser = false) => {
  const payload = {
    sub: user.id,
    data: {
      name: user.name
    }
  }

  if (isBackofficeUser) {
    payload.data.role = user.role
    payload.aud = BACKOFFICE_AUD_TARGET
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, APP_SECRET, options)
}

const generateTokenFromObject = (obj, expires) => {
  const options = {
    expiresIn: expires
  }

  return jwt.sign(obj, APP_SECRET, options)
}

/**
 * Checks if the token in Authorization header is present and valid
 */
const middleware = async (req, res, next) => {
  const token = getTokenFromRequest(req)

  if (!token || !(token.length > 0)) throw new APIError('no_token', 401)

  try {
    await jwt.verify(token, APP_SECRET)
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') throw new APIError('token_expired', 403)
    throw new APIError(e.message.split(' ').join('_').toLowerCase(), 401)
  }
}

const verifyToken = (token, req, res) => {
  if (token && token.length > 0) {
    jwt.verify(token, APP_SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(403).json({ error: error.name, token_is_valid: false })
        } else {
          return res.status(401).json({ error: error.message.split(' ').join('_').toLowerCase(), token_is_valid: false })
        }
      } else {
        return res.status(200).json({ token_is_valid: true })
      }
    })
  } else {
    return false
  }
}

const verifyBackofficePasswordToken = async (token) => {
  if (!token || !(token.length > 0)) throw new APIError('no_token', 401)

  try {
    await jwt.verify(token, APP_SECRET)
    return true
  } catch (e) {
    if (e.name === 'TokenExpiredError') throw new APIError('token_expired', 403)
    throw new APIError(e.message.split(' ').join('_').toLowerCase(), 401)
  }
}

const checkBackofficeUser = async (req, res, next) => {
  const data = getPayload(req)
  if (!data.aud || data.aud !== BACKOFFICE_AUD_TARGET) throw new APIError('invalid_token', 403)
  return next()
}

const decode = jwt.decode

module.exports = {
  getPayload,
  getUserId,
  getTokenFromRequest,
  generateToken,
  middleware,
  generateTokenFromObject,
  decode,
  verifyToken,
  verifyBackofficePasswordToken,
  checkBackofficeUser
}
