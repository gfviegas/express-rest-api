const rfr = require('rfr')
const nodemailer = require('nodemailer')
const template = rfr('config/template')
const pug = require('pug')

const _email = template.email

const MAIL_HOST = process.env.MAIL_HOST
const MAIL_PORT = process.env.MAIL_PORT
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

const getTemplatePath = (templateName) => {
  const templatePath = `${process.cwd()}/templates/mails/${templateName}.pug`
  return templatePath
}

/**
 * sendMail('proton.2016.ti@gmail.com', 'aleson.franca@i9xp.com.br', 'qualquer coisa', data, 'confirmation/confirmation_mail', true)
 * template param example 'confirmation/confirmation_mail'
 **/
const sendMail = (from, to, subject, message, template, html = false) => {
  const templatePath = getTemplatePath(template)

  const transport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
    }
  })

  const opts = {
    from: from,
    to: to,
    subject: subject

  }

  if (html === true && message !== '') {
    const pugData = { _email, ...message }
    opts.html = pug.renderFile(templatePath, pugData)
  }

  if (message !== '' && html === false) {
    opts.text = message
  }

  transport.sendMail(opts, (error, info) => {
    if (error) throw error
    else return info
  })
}

module.exports = { sendMail }
