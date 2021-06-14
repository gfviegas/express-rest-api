const axios = require('axios')

const recache = (url) => {
  return axios({
    method: 'post',
    url: 'http://api.prerender.io/recache',
    data: {
      prerenderToken: process.env.PRERENDER_TOKEN,
      url: url
    }
  });
}

module.exports = {
  recache: recache
}
