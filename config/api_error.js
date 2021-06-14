require('express-async-errors')

class APIError extends Error {
  constructor (message = 'Unhandled error', status = 500) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.message = message
  }
}

global.APIError = APIError
