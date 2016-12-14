const port = process.env.PORT || 8080
const server = {}

server.start = (app) => {
  app.listen(port, () => {
    console.log('------------------------------------------------------------')
    console.log('Express server listening on port ' + port)
    console.log('------------------------------------------------------------')
  })
}

module.exports = server
