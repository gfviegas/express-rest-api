const pug = require('pug')
const emailData = require('../config/template').email
const email = require('emailjs/email')

const server = email.server.connect({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  ssl: true
})

const sendMail = (options) => {
  return new Promise((resolve, reject) => {
    const data = Object.assign({_email: emailData}, options.template.data)
    const mailPath = `${process.cwd()}/templates/mails/${options.template.path}.pug`
    const htmlstream = pug.renderFile(mailPath, data)
    const message = {
      from: `${process.env.MAIL_ACCOUNT_NAME} <${process.env.MAIL_HOST}>`,
      to: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? process.env.MAIL_DEV_FALLBACK : (options.to),
      subject: options.subject,
      attachment:
      [
        {data: htmlstream, alternative: true}
      ]
    }

    server.send(message, (error, info) => {
      if (error) {
        console.log(`[MAIL HELPER] Erro: ${JSON.stringify(error)}`)
        return reject({success: false, error: error})
      }
      return resolve({success: true, info: info})
    })
  })
}

module.exports = {
  sendMail
}
