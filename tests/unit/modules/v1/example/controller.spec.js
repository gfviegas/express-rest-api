const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const controller = rfr('./modules/v1/example/controller')

describe('Module Example: Controller', () => {
  it('should have all routes required methods registred', () => {
    expect(controller).to.contain.all.keys(['create', 'find', 'findById', 'findOneAndUpdate', 'update', 'remove', 'test'])
  })

  describe('Method Test', () => {
    it('should be a function', () => {
      expect(controller.test).to.be.a('function')
    })

    it('should send a valid response', () => {
      let res = {
        status: (code) => {
          return res
        },
        json: (data) => {
          expect(data).to.be.a('object')
          expect(data).to.contain.all.keys(['tested'])
          expect(data.tested).to.be.true
        }
      }

      controller.test({}, res)
    })
  })
})
