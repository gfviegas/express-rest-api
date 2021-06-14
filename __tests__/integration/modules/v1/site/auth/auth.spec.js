const ENDPOINT = '/api/v1/site/auth'

const faker = require('faker/locale/pt_BR')
const rfr = require('rfr')
const Model = rfr('/models/seller').model
const app = rfr('/__tests__/config/app')
const request = require('supertest')
const jwt = rfr('helpers/jwt')
const cnpjGenerate = require('@fnando/cnpj/dist/node')
const { mockPreRegister, makeDataMock } = rfr('/__tests__/mocks/seller')

let User

describe(`testing to ENDPOINT ${ENDPOINT}`, () => {
  beforeAll(async done => {
    User = await Model.create(mockPreRegister)
    done()
  })

  afterAll(async done => {
    await Model.deleteMany({})
    done()
  })

  describe('should be able not authenticate user no body', () => {
    it('should validate required params', async done => {
      const expectedMessage = { error: 'user_not_found' }

      const res = await request(app)
        .post(ENDPOINT)
        .set('Authorization', `basic ${process.env.BASIC_TOKEN}`)
        .send({})

      expect(res.status).toEqual(404)
      expect(res.type).toBe('application/json')
      expect(res.body).toStrictEqual(expectedMessage)
      done()
    })
  })

  describe('should be able return authenticated user and token', () => {
    it('should be able authenticate user with sending parameters', async done => {
      const res = await request(app)
        .post(ENDPOINT)
        .set('Authorization', `basic ${process.env.BASIC_TOKEN}`)
        .send({
          email: User.responsible.email,
          password: '123456'
        })

      const token = jwt.generateToken(User)

      expect(res.status).toEqual(200)
      expect(res.type).toBe('application/json')
      expect(res.body.token).toStrictEqual(token)
      done()
    })
  })

  describe('not should be able authenticated user why user not active', () => {
    it('not should be able authenticate user', async done => {
      const newMockUser = newSellerMock(faker.internet.email(), cnpjGenerate.generate(true), false)
      await Model.deleteMany({})

      const seller = await Model.create(newMockUser)
      const res = await request(app)
        .post(ENDPOINT)
        .set('Authorization', `basic ${process.env.BASIC_TOKEN}`)
        .send({
          email: seller.responsible.email,
          password: newMockUser.responsible.password
        })
      const msgExpect = { error: 'user_inactive' }
      expect(res.status).toEqual(403)
      expect(res.type).toBe('application/json')
      expect(res.body).toStrictEqual(msgExpect)
      done()
    })
  })

  describe('not should be able authenticated user why user not equals password', () => {
    it('not should be able authenticate user why password not valid', async done => {
      const newMockUser = newSellerMock(faker.internet.email(), cnpjGenerate.generate(true), true)
      await Model.deleteMany({})

      const seller = await Model.create(newMockUser)
      const res = await request(app)
        .post(ENDPOINT)
        .set('Authorization', `basic ${process.env.BASIC_TOKEN}`)
        .send({
          email: seller.responsible.email,
          password: ''
        })
      const msgExpect = { error: 'wrong_credentials' }
      expect(res.status).toEqual(422)
      expect(res.type).toBe('application/json')
      expect(res.body).toStrictEqual(msgExpect)
      done()
    })
  })

  describe('should be able not fetch user with not valid token', () => {
    it('get user with invalid token', async done => {
      const newMockUser = newSellerMock(faker.internet.email(), cnpjGenerate.generate(true), true)
      await Model.deleteMany({})

      await Model.create(newMockUser)
      const res = await request(app)
        .get(ENDPOINT)
        .set('Authorization', `basic ${process.env.BASIC_TOKEN}`)
        .send({})

      const msgExpect = { error: 'jwt_malformed' }
      expect(res.status).toEqual(401)
      expect(res.type).toBe('application/json')
      expect(res.body).toStrictEqual(msgExpect)
      done()
    })
  })

  describe('should be able not get user why not exists in database', () => {
    it('try get a user not exists in database', async done => {
      const newMockUser = newSellerMock(faker.internet.email(), cnpjGenerate.generate(true), true)

      const seller = await Model.create(newMockUser)
      await Model.deleteMany({})
      const res = await request(app)
        .get(ENDPOINT)
        .set('Authorization', `Bearer ${jwt.generateToken(seller, false)}`)
        .send({})

      const msgExpect = { error: 'user_not_found' }
      expect(res.status).toEqual(404)
      expect(res.type).toBe('application/json')
      expect(res.body).toStrictEqual(msgExpect)
      done()
    })
  })

  describe('should be able fetch user with not valid token', () => {
    it('get user with valid token', async done => {
      const newMockUser = newSellerMock(faker.internet.email(), cnpjGenerate.generate(true), true)
      await Model.deleteMany({})

      const seller = await Model.create(newMockUser)

      const res = await request(app)
        .get(ENDPOINT)
        .set('Authorization', `Bearer ${jwt.generateToken(seller, false)}`)
        .send({})

      expect(res.status).toEqual(200)
      expect(res.type).toBe('application/json')
      expect(res.body.responsible.email).toBe(seller.responsible.email)
      expect(res.body.id).toStrictEqual(seller.id)
      done()
    })
  })
})
