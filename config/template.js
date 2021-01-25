const email = {
  base_url: process.env.FRONT_URL,
  admin_url: process.env.BACKOFFICE_URL,
  base_name: process.env.BACKOFFICE_URL,
  logo: `${process.env.ASSETS_URL}/img/logo.png`,
  imgPath: `${process.env.ASSETS_URL}/img`
}

const configure = (app) => {
  app.set('view engine', 'pug')
  app.set('views', './templates')

  app.locals._email = email
}

module.exports = {
  email,
  configure
}
