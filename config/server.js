let port = process.env.PORT || 8080

if (process.env.NODE_ENV === 'test') {
  port = process.env.PORT_TEST
}

const server = {}

server.start = (app) => {
  app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('------------------------------------------------------------')
      console.log('Express server listening on port ' + port)
      console.log('------------------------------------------------------------')
    }
  })
}

module.exports = server
