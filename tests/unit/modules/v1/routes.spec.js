const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const moduleRoutes = rfr('./modules/v1/routes')
const routesHelper = rfr('./tests/helpers/routes')(moduleRoutes)
const routes = routesHelper.getRoutes()

describe('Modules V1: Routes', () => {
  console.log(routes)
  describe('HEAD', () => {
    it('should not have any HEAD routes', () => {
      expect(routes.head.length).to.equal(0)
    })
  })
  describe('GET', () => {
    it('should have a GET /test route', () => {
      expect(routesHelper.checkRoute('get', '/test')).to.be.true
    })
  })
  describe('POST', () => {
    it('should not have any POST routes', () => {
      expect(routes.post.length).to.equal(0)
    })
  })
  describe('PUT', () => {
    it('should not have any PUT routes', () => {
      expect(routes.put.length).to.equal(0)
    })
  })
  describe('PATCH', () => {
    it('should not have any PATCH routes', () => {
      expect(routes.patch.length).to.equal(0)
    })
  })
  describe('DELETE', () => {
    it('should not have any DELETE routes', () => {
      expect(routes.delete.length).to.equal(0)
    })
  })
})
