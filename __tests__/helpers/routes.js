// module.exports = (routes) => {
//   const registredRoutes = {
//     head: [],
//     get: [],
//     post: [],
//     put: [],
//     patch: [],
//     delete: []
//   }

//   routes.stack.forEach((r) => {
//     if (r.route && r.route.path) {
//       const routeMethods = Object.keys(r.route.methods)
//       routeMethods.forEach((method) => {
//         registredRoutes[method].push(r.route.path)
//       })
//     }
//   })

//   return {
//     getRoutes: () => {
//       return registredRoutes
//     },
//     checkRoute: (method, path) => {
//       return !!(registredRoutes[method].indexOf(path) > -1)
//     }
//   }
// }
