const rfr = require('rfr')
const { NODE_ENV, BASE_NAME } = process.env
const { version: VERSION } = rfr('package.json')
const mailer = require('./mail')

exports.sendErrorMail = (data) => {
  const options = {
    to: '',
    subject: `⚠️ Erro em ${BASE_NAME}:${VERSION} ⚠️`,
    template: {
      path: 'error/index',
      data: data
    }
  }
  mailer.sendMail(options)
}

exports.errorHandler = (err, _req, res, _next) => {
  const { status = 500, message, stack } = err
  let payload = { error: message }

  if (NODE_ENV !== 'production' && status === 500) payload = Object.assign(payload, { stack })
  return res.status(status).json(payload)
}
