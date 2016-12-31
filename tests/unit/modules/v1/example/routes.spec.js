const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const moduleRoutes = rfr('./modules/v1/example/routes')
const routesHelper = rfr('./tests/helpers/routes')
const routes = routesHelper.routes(moduleRoutes)

describe('Module Example: Routes', () => {
  describe('HEAD', () => {
    it('should not have any HEAD routes', () => {
      expect(routes.head.length).to.equal(0)
    })
  })
  describe('GET', () => {
    it('should have a GET / route', () => {
      expect(routesHelper.checkRoute('get', '/')).to.be.true
    })
    it('should have a GET /:id route', () => {
      expect(routesHelper.checkRoute('get', '/:id')).to.be.true
    })
    it('should have a GET /test route', () => {
      expect(routesHelper.checkRoute('get', '/test')).to.be.true
    })
  })
  describe('POST', () => {
    it('should have a POST / route', () => {
      expect(routesHelper.checkRoute('post', '/')).to.be.true
    })
  })
  describe('PUT', () => {
    it('should have a PUT /:id route', () => {
      expect(routesHelper.checkRoute('put', '/:id')).to.be.true
    })
  })
  describe('PATCH', () => {
    it('should have a PATCH /:id route', () => {
      expect(routesHelper.checkRoute('patch', '/:id')).to.be.true
    })
  })
  describe('DELETE', () => {
    it('should have a DELETE /:id route', () => {
      expect(routesHelper.checkRoute('delete', '/:id')).to.be.true
    })
  })
})
