const registredRoutes = {
  'head': [],
  'get': [],
  'post': [],
  'put': [],
  'patch': [],
  'delete': []
}

module.exports = {
  routes: (routes) => {
    routes.stack.forEach((r) => {
      if (r.route && r.route.path) {
        let routeMethods = Object.keys(r.route.methods)
        routeMethods.forEach((method) => {
          registredRoutes[method].push(r.route.path)
        })
      }
    })

    return registredRoutes
  },
  checkRoute: (method, path) => {
    return !!(registredRoutes[method].indexOf(path) > -1)
  }
}
