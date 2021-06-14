// const rfr = require('rfr')
// const jwtHelper = rfr('helpers/jwt')

// module.exports = (Model) => {
//   const helper = {}

//   helper.getAuthorizedUser = (query) => {
//     return Model.findOne(query)
//   }

//   helper.getJWTFromUser = (user) => {
//     return jwtHelper.generateToken(user)
//   }

//   helper.getJWTFromUserQuery = (query) => {
//     return async (resolve, _reject) => {
//       const user = await helper.getAuthorizedUser(query)
//       return resolve(jwtHelper.generateToken(user))
//     }
//   }

//   return helper
// }
