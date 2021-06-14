
// const req = {
//   checkParams: () => { },
//   checkBody: () => { },
//   notEmpty: () => { },
//   len: () => { },
//   isEmail: () => { },
//   isMongoId: () => { },
//   isBoolean: () => { },
//   matches: () => { },
//   isIn: () => { },
//   getValidationResult: () => { }
// }
// const checkBody = (req) => { return sinon.stub(req, 'checkBody').returnsThis() }
// const checkParams = (req) => { return sinon.stub(req, 'checkParams').returnsThis() }
// const notEmpty = (req) => { return sinon.stub(req, 'notEmpty').returnsThis() }
// const len = (req) => { return sinon.stub(req, 'len').returnsThis() }
// const isEmail = (req) => { return sinon.stub(req, 'isEmail').returnsThis() }
// const isIn = (req) => { return sinon.stub(req, 'isIn').returnsThis() }
// const isMongoId = (req) => { return sinon.stub(req, 'isMongoId').returnsThis() }
// const isBoolean = (req) => { return sinon.stub(req, 'isBoolean').returnsThis() }
// const matches = (req) => { return sinon.stub(req, 'matches').returnsThis() }
// const getValidationResult = (req) => {
//   return sinon.stub(req, 'getValidationResult').callsFake(() => {
//     return new Promise((resolve, reject) => {
//       resolve({
//         array: () => {
//           return []
//         },
//         mapped: () => {
//           return []
//         },
//         isEmpty: () => {
//           return true
//         },
//         next: () => { }
//       })
//     })
//   })
// }

// const res = {
//   status: () => { },
//   json: () => { }
// }
// const status = sinon.stub(res, 'status').returnsThis()
// const json = sinon.stub(res, 'json').returnsThis()

// module.exports = {
//   stubReq: () => { return req },
//   stubCheckBody: (req) => { return checkBody(req) },
//   stubCheckParams: (req) => { return checkParams(req) },
//   stubNotEmpty: (req) => { return notEmpty(req) },
//   stubLen: (req) => { return len(req) },
//   stubIsEmail: (req) => { return isEmail(req) },
//   stubIsMongoId: (req) => { return isMongoId(req) },
//   stubIsBoolean: (req) => { return isBoolean(req) },
//   stubMatches: (req) => { return matches(req) },
//   stubIsIn: (req) => { return isIn(req) },
//   stubGetValidationResult: (req) => { return getValidationResult(req) },

//   stubRes: (req) => { return res(req) },
//   stubStatus: (req) => { return status(req) },
//   stubJson: (req) => { return json(req) }
// }
