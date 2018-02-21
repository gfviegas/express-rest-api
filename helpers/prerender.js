const request = require('request-promise')

const recache = (url) => {
  const options = {
    method: 'POST',
    uri: 'http://api.prerender.io/recache',
    body: {
      prerenderToken: process.env.PRERENDER_TOKEN,
      url: url
    },
    json: true
  }
  return request('http://api.prerender.io/recache', options)
}

module.exports = {
  recache: recache
}
