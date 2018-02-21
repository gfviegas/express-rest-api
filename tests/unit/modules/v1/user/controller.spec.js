const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const controller = rfr('./modules/v1/user/controller')

describe('Module User: Controller', () => {
  it('should have all routes required methods registred', () => {
    expect(controller).to.contain.all.keys(['create', 'find', 'findById', 'findOneAndUpdate', 'update', 'remove', 'checkExists'])
  })

  describe('Method checkExists', () => {
    it('should be a function', () => {
      expect(controller.checkExists).to.be.a('function')
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

      controller.checkExists({}, res)
    })
  })
})
