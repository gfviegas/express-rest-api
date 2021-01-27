// const rfr = require('rfr')

// const request = require('supertest')
// const chai = require('chai')
// const sinon = require('sinon')
// const expect = chai.expect

// const app = rfr('tests/config/app')
// const mongoose = require('mongoose')
// const Model = mongoose.model('user')
// const auth = rfr('tests/helpers/auth')(Model)
// const jwtHelper = require('jsonwebtoken')

// const ENDPOINT = '/api/v1/auth'

// describe(ENDPOINT, () => {
//   let someUser, someUserData, someUserToken, someUserHeader

//   before(async () => {
//     someUserData = { username: 'testAuth', name: 'test', email: 'testAuth@test.com', password: 'test', active: true }
//     someUser = await Model.create(someUserData)
//     someUserToken = auth.getJWTFromUser(someUser)
//     someUserHeader = { authorization: `Bearer ${someUserToken}` }
//   })

//   after(async () => {
//     Model.remove({ username: 'testAuth' })
//   })

//   describe('POST /', () => {
//     let userCredentials

//     before(async () => {
//       userCredentials = { username: someUserData.username, password: someUserData.password }
//     })

//     it('should validate required params', async () => {
//       const expectedMessage = {
//         password: { msg: { error: 'required' } },
//         username: { msg: { error: 'required' } }
//       }

//       const res = await request(app)
//         .post(ENDPOINT)
//         .send({})

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.shallowDeepEqual(expectedMessage)
//       expect(res.status).to.equal(422)
//     })

//     it('should respond with success status and the JWT when valid data is sent', async () => {
//       const res = await request(app)
//         .post(ENDPOINT)
//         .send(userCredentials)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.contain.all.keys(['token'])
//       expect(res.status).to.equal(200)
//     })
//   })

//   describe('GET /', () => {
//     it('should not accept unauthenticated request', async () => {
//       const expectedMessage = { error: 'no_token' }
//       const res = await request(app)
//         .get(ENDPOINT)
//         .expect(401)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.deep.equal(expectedMessage)
//     })

//     it('should respond with success status', async () => {
//       const res = await request(app)
//         .get(ENDPOINT)
//         .set(someUserHeader)
//         .expect(200)

//       expect(res.type).to.equal('application/json')
//     })

//     it('should return valid data', async () => {
//       const res = await request(app)
//         .get(ENDPOINT)
//         .set(someUserHeader)
//         .expect(200)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.contain.all.keys(['_id', 'updated_at', 'created_at', 'name', 'email', 'username', 'active'])
//       expect(res.body.username).to.equal(someUser.username)
//     })

//     it('should validate if token is expired', async () => {
//       const payload = { sub: someUser.id, data: { name: someUser.name }, iat: 1437018582 }
//       const expiredToken = jwtHelper.sign(payload, process.env.APP_SECRET, { expiresIn: 1 })
//       const hackedHeader = { authorization: `Bearer ${expiredToken}` }

//       const clock = sinon.useFakeTimers(1437018582)
//       await clock.tick(1437018650000)

//       const res = await request(app)
//         .get(ENDPOINT)
//         .set(hackedHeader)
//         .expect(403)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.contain.all.keys(['error'])
//       expect(res.body.error).to.equal('token_expired')
//     })

//     it('should validate if token signature is invalid', async () => {
//       const hackedHeader = { authorization: `${someUserHeader.authorization}Aa + aa` }
//       const res = await request(app)
//         .get(ENDPOINT)
//         .set(hackedHeader)
//         .expect(401)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.contain.all.keys(['error'])
//       expect(res.body.error).to.equal('invalid_signature')
//     })

//     it('should validate if token is malformed', async () => {
//       const hackedHeader = { authorization: `Bearer ${someUserHeader.authorization}A` }
//       const res = await request(app)
//         .get(ENDPOINT)
//         .set(hackedHeader)
//         .expect(401)

//       expect(res.type).to.equal('application/json')
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.contain.all.keys(['error'])
//       expect(res.body.error).to.equal('jwt_malformed')
//     })
//   })
// })
