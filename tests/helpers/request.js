const sinon = require('sinon')
const req = {
  checkBody: () => {},
  notEmpty: () => {},
  len: () => {},
  isEmail: () => {},
  getValidationResult: () => {}
}
const checkBody = (req) => { return sinon.stub(req, 'checkBody').returnsThis() }
const notEmpty = (req) => { return sinon.stub(req, 'notEmpty').returnsThis() }
const len = (req) => { return sinon.stub(req, 'len').returnsThis() }
const isEmail = (req) => { return sinon.stub(req, 'isEmail').returnsThis() }
const getValidationResult = (req) => {
  return sinon.stub(req, 'getValidationResult', () => {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  })
}

const res = {
  status: () => {},
  json: () => {}
}
const status = sinon.stub(res, 'status').returnsThis()
const json = sinon.stub(res, 'json').returnsThis()

module.exports = {
  stubReq: () => { return req },
  stubCheckBody: (req) => { return checkBody(req) },
  stubNotEmpty: (req) => { return notEmpty(req) },
  stubLen: (req) => { return len(req) },
  stubIsEmail: (req) => { return isEmail(req) },
  stubGetValidationResult: (req) => { return getValidationResult(req) },

  stubRes: (req) => { return res(req) },
  stubStatus: (req) => { return status(req) },
  stubJson: (req) => { return json(req) }
}
