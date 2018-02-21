const email = {
  base_url: process.env.SITE_URL,
  admin_url: process.env.ADMIN_URL,
  base_name: process.env.ADMIN_URL,
  contact: {
    email: process.env.CONTACT_EMAIL
  },
  logo: `${process.env.ASSETS_URL}img/logo.png`,
  imgPath: `${process.env.ASSETS_URL}img/`
}

const configure = (app) => {
  app.set('view engine', 'pug')
  app.set('views', './templates')

  app.locals._email = email
}

module.exports = {
  email: email,
  configure: configure
}
