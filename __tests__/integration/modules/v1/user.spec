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
  let authorizedUserToken, authorizedHeader, authorizedUser

  before(async () => {
    authorizedUser = await Model.create({ username: 'test0', name: 'test', email: 'test0@test.com', password: 'test', active: true })
    authorizedUserToken = auth.getJWTFromUser(authorizedUser)
    authorizedHeader = { authorization: `Bearer ${authorizedUserToken}` }
  })

  after(async () => {
    Model.remove({ username: 'test0' })
  })

  describe('POST /', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = { error: 'no_token' }
      const res = await request(app)
        .post(ENDPOINT)
        .send({ })

      expect(res.type).to.equal('application/json')
      expect(res.body).to.deep.equal(expectedMessage)
      expect(res.status).to.equal(401)
    })

    it('should validate required params', async () => {
      const expectedMessage = {
        active: { msg: { error: 'required' } },
        name: { msg: { error: 'required' } },
        email: { msg: { error: 'required' } },
        password: { msg: { error: 'required' } },
        username: { msg: { error: 'required' } }
      }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send({ })

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(422)
    })

    it('should validate invalid params', async () => {
      const expectedMessage = {
        email: { msg: { error: 'invalid' } },
        active: { msg: { error: 'invalid' } },
        name: { msg: { error: 'length', max: 20, min: 4 } },
        password: { msg: { error: 'length', max: 20, min: 6 } },
        username: { msg: { error: 'length', max: 20, min: 4 } }
      }
      const userData = { email: '2--01', password: 'abcde', username: 'abc', active: 'NOT A BOOLEAN', name: 'asd' }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(422)
    })

    it('should validate username uniqueness', async () => {
      const expectedMessage = { username: { msg: { error: 'unique' } } }
      const userData = { email: 'tes201@test.com', password: '111abcde', username: 'test0', active: true, name: 'new user' }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(409)
    })

    it('should validate email uniqueness', async () => {
      const expectedMessage = { email: { msg: { error: 'unique' } } }
      const userData = { email: 'test0@test.com', password: '111abcde', username: 'johntravolta', active: true, name: 'new user' }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(409)
    })

    it('should respond with success status and the created user when valid data is sent', async () => {
      const userData = { email: 'testing0@gmail.com', password: 'potato', username: 'potatouser0', active: true, name: 'test batata' }
      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      testEntityValue(res.body, userData)
      expect(res.status).to.equal(201)
    })

    it('should create a new record on DB when valid data is sent', async () => {
      const userCount = await Model.find({}).count().exec()
      const userData = { email: 'testing1@gmail.com', password: 'potato', username: 'potatouser1', active: true, name: 'batata test' }

      const res = await request(app)
        .post(ENDPOINT)
        .set(authorizedHeader)
        .send(userData)

      const newUserCount = await Model.find({}).count().exec()
      expect(newUserCount).to.equal(userCount + 1)
      const newUserFind = await Model.find({ username: res.username }).count().exec()
      expect(newUserFind._id).to.equal(res._id)
    })
  })

  describe('GET /', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = { error: 'no_token' }
      const res = await request(app)
        .get(ENDPOINT)
        .expect(401)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.deep.equal(expectedMessage)
    })

    it('should respond with success status', async () => {
      const res = await request(app)
        .get(ENDPOINT)
        .set(authorizedHeader)
        .expect(200)

      expect(res.type).to.equal('application/json')
    })

    it('should return valid data', async () => {
      const res = await request(app)
        .get(ENDPOINT)
        .set(authorizedHeader)
        .expect(200)

      expect(res.type).to.equal('application/json')
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

  describe('GET /:id', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = { error: 'no_token' }
      const res = await request(app)
        .get(ENDPOINT)
        .expect(401)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.deep.equal(expectedMessage)
    })

    it('should respond a 404 when not found', async () => {
      const res = await request(app)
        .get(`${ENDPOINT}/585359000214ed0c00fa00a0`)
        .set(authorizedHeader)
        .expect(404)

      expect(res.type).to.equal('application/json')
    })

    it('should respond a valid found entity', async () => {
      const res = await request(app)
        .get(`${ENDPOINT}/${authorizedUser._id}`)
        .set(authorizedHeader)
        .expect(200)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.be.an('object')
      expect(res.body).to.contain.all.keys(['permissions', 'active', '_id', 'email', 'username', 'name', 'created_at', 'updated_at'])
    })
  })

  describe('PATCH /:id', () => {
    let someNewUser

    before(async () => {
      someNewUser = await Model.create({ username: 'toupdate', name: 'updated', email: 'test0@update.com', password: 'update', active: true })
    })

    it('should not accept unauthenticated request', async () => {
      const expectedMessage = { error: 'no_token' }
      const res = await request(app)
        .patch(`${ENDPOINT}/${authorizedUser._id}`, {})
        .expect(401)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.deep.equal(expectedMessage)
    })

    it('should respond a 404 when not found', async () => {
      const res = await request(app)
        .patch(`${ENDPOINT}/585359000214ed0c00000000`)
        .set(authorizedHeader)
        .send({ username: 'abasasasc' })

      expect(res.type).to.equal('application/json')
      expect(res.status).to.equal(404)
    })

    it('should validate invalid params', async () => {
      const expectedMessage = {
        email: { msg: { error: 'invalid' } },
        active: { msg: { error: 'invalid' } },
        name: { msg: { error: 'length', max: 20, min: 4 } },
        username: { msg: { error: 'length', max: 20, min: 4 } }
      }
      const userData = { email: '2--01', username: 'abc', active: 'NOT A BOOLEAN', name: 'asd' }

      const res = await request(app)
        .patch(`${ENDPOINT}/${authorizedUser._id}`)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(422)
    })

    it('should validate username uniqueness', async () => {
      const expectedMessage = { username: { msg: { error: 'unique' } } }
      const userData = { username: 'test0' }

      const res = await request(app)
        .patch(`${ENDPOINT}/${someNewUser._id}`)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(409)
    })

    it('should validate email uniqueness', async () => {
      const expectedMessage = { email: { msg: { error: 'unique' } } }
      const userData = { email: 'test0@test.com' }

      const res = await request(app)
        .patch(`${ENDPOINT}/${someNewUser._id}`)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      expect(res.body).to.shallowDeepEqual(expectedMessage)
      expect(res.status).to.equal(409)
    })

    it('should respond with success status and the created user when valid data is sent', async () => {
      const userData = { username: 'potatouser222', name: 'TEST' }
      const res = await request(app)
        .patch(`${ENDPOINT}/${authorizedUser._id}`)
        .set(authorizedHeader)
        .send(userData)

      expect(res.type).to.equal('application/json')
      testEntityValue(res.body, userData)
      expect(res.status).to.equal(200)
    })

    it('should update the matching record on DB when valid data is sent', async () => {
      const oldUserData = await Model.findById(authorizedUser._id).exec()
      const userData = { active: false, name: 'batata test' }

      const res = await request(app)
        .patch(`${ENDPOINT}/${authorizedUser._id}`)
        .set(authorizedHeader)
        .send(userData)

      expect(res.body.active).to.not.equal(oldUserData.active)
      expect(res.body._id).to.equal(res.body._id)
    })
  })

  describe('DELETE /:id', () => {
    it('should not accept unauthenticated request', async () => {
      const expectedMessage = { error: 'no_token' }
      const res = await request(app)
        .delete(`${ENDPOINT}/${authorizedUser._id}`, {})
        .expect(401)

      expect(res.body).to.deep.equal(expectedMessage)
    })

    it('should respond a 404 when not found', async () => {
      const res = await request(app)
        .delete(`${ENDPOINT}/585359000214ed0c00000000`)
        .set(authorizedHeader)
        .expect(404)

      expect(res.status).to.equal(404)
    })

    it('should respond with success status and the created user when valid data is sent', async () => {
      const toDeleteUser = await Model.create({ username: 'todelete', name: 'will be deleted', email: 'test0@delete.com', password: 'delete', active: true })
      const res = await request(app)
        .delete(`${ENDPOINT}/${toDeleteUser._id}`)
        .set(authorizedHeader)
        .expect(204)

      expect(res.status).to.equal(204)
    })

    it('should remove the matching record on DB when authorized request', async () => {
      const toDeleteUser = await Model.create({ username: 'todelete1', name: 'will be deleted', email: 'tes1t0@delete.com', password: 'delete', active: true })
      await request(app)
        .delete(`${ENDPOINT}/${toDeleteUser._id}`)
        .set(authorizedHeader)
        .expect(204)

      const queryingUser = await Model.find({ _id: toDeleteUser._id }).count()
      expect(queryingUser).to.equal(0)
    })
  })
})
