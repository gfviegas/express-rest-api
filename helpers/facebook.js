const FB = require('fb')

const options = {
  appId: process.env.FB_ID,
  appSecret: process.env.FB_SECRET,
  accessToken: process.env.FB_TOKEN
}

FB.options(options)
FB.setAccessToken(process.env.FB_TOKEN)

module.exports = FB
