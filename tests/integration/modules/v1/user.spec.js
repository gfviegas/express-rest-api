const rfr = require('rfr')

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect

const app = rfr('tests/config/app')
const mongoose = require('mongoose')
const Model = mongoose.model('user')
const auth = rfr('tests/helpers/auth')(Model)

const ENDPOINT = '/api/v1/users'

const testEntityValue = (entity, value) => {
  expect(entity).to.be.an('object')
  expect(entity).to.contain.all.keys(['_id', 'updated_at', 'created_at', 'name', 'email', 'username', 'active'])

  if (value && value.username) expect(entity.username).to.equal(value.username)
}

describe(ENDPOINT, () => {
  let authorizedUserToken, authorizedHeader

  before(async () => {
    const user = await Model.create({username: 'test0', name: 'test', email: 'test0@test.com', password: 'test', active: true})
    authorizedUserToken = auth.getJWTFromUser(user)
    authorizedHeader = {authorization: `Bearer ${authorizedUserToken}`}
  })

  after(async () => {
    Model.remove({username: 'test0'})
  })

  describe('POST /', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = {error: 'no_token'}
      const res = await request(app)
        .post(ENDPOINT)
        .send({ })

      expect(res.type).to.equal(`application/json`)
      expect(res.body).to.deep.equal(expectedMessage)
      expect(res.status).to.equal(401)
    })

    it('should validate required params', async () => {
      const expectedMessage = {
        active: {msg: {error: 'required'}},
        name: {msg: {error: 'required'}},
        email: {msg: {error: 'required'}},
        password: {msg: {error: 'required'}},
        username: {msg: {error: 'required'}}
      }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send({ })

      expect(res.type).to.equal(`application/json`)
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(422)
    })

    it('should validate invalid params', async () => {
      const expectedMessage = {
        email: {msg: {error: 'invalid'}},
        active: {msg: {error: 'invalid'}},
        name: {msg: {error: 'length', max: 20, min: 4}},
        password: {msg: {error: 'length', max: 20, min: 6}},
        username: {msg: {error: 'length', max: 20, min: 4}}
      }
      const userData = {email: '2--01', password: 'abcde', username: 'abc', active: 'NOT A BOOLEAN', name: 'asd'}

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal(`application/json`)
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(422)
    })

    it('should respond with success status and the created user when valid data is sent', async () => {
      const userData = {email: 'testing0@gmail.com', password: 'potato', username: 'potatouser0', active: true, name: 'test batata'}
      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal(`application/json`)
      testEntityValue(res.body, userData)
      expect(res.status).to.equal(201)
    })

    it('should create a new record on DB when valid data is sent', async () => {
      const userCount = await Model.find({}).count().exec()
      const userData = {email: 'testing1@gmail.com', password: 'potato', username: 'potatouser1', active: true, name: 'batata test'}

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      const newUserCount = await Model.find({}).count().exec()
      expect(newUserCount).to.equal(userCount + 1)
      const newUserFind = await Model.find({username: res.username}).count().exec()
      expect(newUserFind._id).to.equal(res._id)
    })
  })

  describe('GET /', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = {error: 'no_token'}
      const res = await request(app)
        .get(ENDPOINT)
        .expect(401)

      expect(res.type).to.equal(`application/json`)
      expect(res.body).to.deep.equal(expectedMessage)
    })

    it('should respond with success status', async () => {
      const res = await request(app)
        .get(ENDPOINT)
        .set(authorizedHeader)
        .expect(200)

      expect(res.type).to.equal(`application/json`)
    })

    it('should return valid data', async () => {
      const res = await request(app)
        .get(ENDPOINT)
        .set(authorizedHeader)
        .expect(200)

      expect(res.type).to.equal(`application/json`)
      expect(res.body).to.contain.all.keys(['users', 'meta'])
      expect(res.body.meta).to.be.an('object')
      expect(res.body.meta).to.contain.all.keys(['currentPage', 'limit', 'totalPages', 'count'])
      expect(res.body.users).to.be.an('array')
      res.body.users.every(u => {
        expect(u).to.be.an('object')
        expect(u).to.contain.all.keys(['permissions', 'active', '_id', 'email', 'username', 'name', 'created_at', 'updated_at'])
        return true
      })
    })
  })

  // describe('GET /:id', () => {
  //   it('should respond a 404 when not found', () => {
  //     request(app)
  //       .get(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
  //       .expect('Content-Type', /json/)
  //       .expect(404, )
  //   })
  //   it('should respond a valid found example', () => {
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .get(`${ENDPOINT}/${entity._id}`)
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           testEntityValue(res.body)
  //         })
  //         .expect(200, )
  //     })
  //   })
  // })
  //
  // describe('PUT /:id', () => {
  //   it('should respond a 404 when not found', () => {
  //     request(app)
  //       .put(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
  //       .expect('Content-Type', /json/)
  //       .expect(404, )
  //   })
  //
  //   it('should validate required params', () => {
  //     const expectedMessage = {
  //       name: { param: 'name', msg: { error: 'required' } },
  //       email: { param: 'email', msg: { error: 'required' } }
  //     }
  //
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .put(`${ENDPOINT}/${entity._id}`)
  //         .send({ })
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           expect(res.body).to.deep.equal(expectedMessage)
  //         })
  //         .expect(422, )
  //     })
  //   })
  //
  //   it('should validate invalid params', () => {
  //     const expectedMessage = {
  //       email: { param: 'email', msg: { error: 'invalid' }, value: '2--01' }
  //     }
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .put(ENDPOINT + entity._id)
  //         .send({ name: 'teste', email: '2--01' })
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           expect(res.body).to.deep.equal(expectedMessage)
  //         })
  //         .expect(422, )
  //     })
  //   })
  //
  //   it('should respond a replaced data when valid data is sent', () => {
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .put(ENDPOINT + entity._id)
  //         .send({ name: 'updated', email: 'updated@updated.com' })
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           testEntityValue(res.body)
  //           expect(res.body.name).to.equal('updated')
  //           expect(res.body.email).to.equal('updated@updated.com')
  //         })
  //         .expect(200, )
  //     })
  //   })
  // })
  //
  // describe('PATCH /:id', () => {
  //   it('should respond a 404 when not found', () => {
  //     request(app)
  //       .patch(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
  //       .expect('Content-Type', /json/)
  //       .expect(404, )
  //   })
  //
  //   it('should validate invalid params', () => {
  //     const expectedMessage = {
  //       email: { param: 'email', msg: { error: 'invalid' }, value: '2--01' }
  //     }
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .patch(ENDPOINT + entity._id)
  //         .send({ email: '2--01' })
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           expect(res.body).to.deep.equal(expectedMessage)
  //         })
  //         .expect(422, )
  //     })
  //   })
  //
  //   it('should respond a replaced data when valid data is sent', () => {
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .patch(ENDPOINT + entity._id)
  //         .send({ email: 'patched@patched.com' })
  //         .expect('Content-Type', /json/)
  //         .expect((res) => {
  //           testEntityValue(res.body)
  //           expect(res.body.name).to.equal(entity.name)
  //           expect(res.body.email).to.equal('patched@patched.com')
  //         })
  //         .expect(200, )
  //     })
  //   })
  // })
  //
  // describe('DELETE /:id', () => {
  //   it('should respond a 404 when not found', () => {
  //     request(app)
  //       .delete(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
  //       .expect('Content-Type', /json/)
  //       .expect(404, )
  //   })
  //
  //   it('should respond a valid status when deleting data', () => {
  //     findSomeExampleId().then((entity) => {
  //       request(app)
  //         .delete(ENDPOINT + entity._id)
  //         .expect('Content-Type', /json/)
  //         .expect(204, )
  //     })
  //   })
  // })
})
