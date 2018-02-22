const rfr = require('rfr')
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect

const exampleModel = rfr('./modules/v1/users/model').model
const app = rfr('./tests/config/app')

const ENDPOINT = 'api/v1/users'

const testEntityValue = (example) => {
  expect(example).to.be.an('object')
  expect(example).to.contain.all.keys(['_id', 'updated_at', 'created_at', 'name', 'email'])
}

const findSomeExampleId = () => {
  return exampleModel.findOne({}).exec()
}

describe(ENDPOINT, () => {
  describe('POST /', () => {
    it('should validate required params', (done) => {
      const expectedMessage = {
        name: { param: 'name', msg: { error: 'required' } },
        email: { param: 'email', msg: { error: 'required' } }
      }

      request(app)
        .post(ENDPOINT)
        .send({ })
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.deep.equal(expectedMessage)
        })
        .expect(422, done)
    })

    it('should validate invalid params', (done) => {
      const expectedMessage = {
        email: { param: 'email', msg: { error: 'invalid' }, value: '2--01' }
      }

      request(app)
        .post(ENDPOINT)
        .send({ name: 'teste', email: '2--01' })
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.deep.equal(expectedMessage)
        })
        .expect(422, done)
    })

    it('should respond with success status when valid data is sent', (done) => {
      request(app)
        .post(ENDPOINT)
        .send({ name: 'teste', email: 'teste@teste.com' })
        .expect('Content-Type', /json/)
        .expect((res) => {
          testEntityValue(res.body)
        })
        .expect(201, done)
    })
  })

  describe('GET /', () => {
    it('should respond with success status', (done) => {
      request(app)
        .get(ENDPOINT)
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })

  describe('GET /:id', () => {
    it('should respond a 404 when not found', (done) => {
      request(app)
        .get(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
    it('should respond a valid found example', (done) => {
      findSomeExampleId().then((entity) => {
        request(app)
          .get(`${ENDPOINT}/${entity._id}`)
          .expect('Content-Type', /json/)
          .expect((res) => {
            testEntityValue(res.body)
          })
          .expect(200, done)
      })
    })
  })

  describe('PUT /:id', () => {
    it('should respond a 404 when not found', (done) => {
      request(app)
        .put(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })

    it('should validate required params', (done) => {
      const expectedMessage = {
        name: { param: 'name', msg: { error: 'required' } },
        email: { param: 'email', msg: { error: 'required' } }
      }

      findSomeExampleId().then((entity) => {
        request(app)
          .put(`${ENDPOINT}/${entity._id}`)
          .send({ })
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body).to.deep.equal(expectedMessage)
          })
          .expect(422, done)
      })
    })

    it('should validate invalid params', (done) => {
      const expectedMessage = {
        email: { param: 'email', msg: { error: 'invalid' }, value: '2--01' }
      }
      findSomeExampleId().then((entity) => {
        request(app)
          .put(ENDPOINT + entity._id)
          .send({ name: 'teste', email: '2--01' })
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body).to.deep.equal(expectedMessage)
          })
          .expect(422, done)
      })
    })

    it('should respond a replaced data when valid data is sent', (done) => {
      findSomeExampleId().then((entity) => {
        request(app)
          .put(ENDPOINT + entity._id)
          .send({ name: 'updated', email: 'updated@updated.com' })
          .expect('Content-Type', /json/)
          .expect((res) => {
            testEntityValue(res.body)
            expect(res.body.name).to.equal('updated')
            expect(res.body.email).to.equal('updated@updated.com')
          })
          .expect(200, done)
      })
    })
  })

  describe('PATCH /:id', () => {
    it('should respond a 404 when not found', (done) => {
      request(app)
        .patch(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })

    it('should validate invalid params', (done) => {
      const expectedMessage = {
        email: { param: 'email', msg: { error: 'invalid' }, value: '2--01' }
      }
      findSomeExampleId().then((entity) => {
        request(app)
          .patch(ENDPOINT + entity._id)
          .send({ email: '2--01' })
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body).to.deep.equal(expectedMessage)
          })
          .expect(422, done)
      })
    })

    it('should respond a replaced data when valid data is sent', (done) => {
      findSomeExampleId().then((entity) => {
        request(app)
          .patch(ENDPOINT + entity._id)
          .send({ email: 'patched@patched.com' })
          .expect('Content-Type', /json/)
          .expect((res) => {
            testEntityValue(res.body)
            expect(res.body.name).to.equal(entity.name)
            expect(res.body.email).to.equal('patched@patched.com')
          })
          .expect(200, done)
      })
    })
  })

  describe('DELETE /:id', () => {
    it('should respond a 404 when not found', (done) => {
      request(app)
        .delete(`${ENDPOINT}/585359000214ed0c0cfa00a0`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })

    it('should respond a valid status when deleting data', (done) => {
      findSomeExampleId().then((entity) => {
        request(app)
          .delete(ENDPOINT + entity._id)
          .expect('Content-Type', /json/)
          .expect(204, done)
      })
    })
  })
})
