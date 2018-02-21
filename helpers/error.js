const mailer = require('./mailer')

const sendErrorMail = (data) => {
  const options = {
    to: '',
    subject: `⚠️ Erro em ${process.env.APP_DISPLAY_NAME} ⚠️`,
    template: {
      path: 'error/index',
      data: data
    }
  }
  mailer.sendMail(options)
}

module.exports = {
  sendMail: sendErrorMail
}
