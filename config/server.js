const port = process.env.PORT || 8080
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
