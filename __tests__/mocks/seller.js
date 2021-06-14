
const faker = require('faker/locale/pt_BR')
const cnpj = require('@fnando/cnpj/dist/node')
const _cnpj = cnpj.generate(true)
const _phoneNumber = faker.phone.phoneNumber()
const _name = faker.name.findName()

faker.locale = 'pt_BR'
faker.seed(83)

const mockPreRegister = {
  sold_by: _name,
  document: _cnpj.replace(/\D/g, ''),
  responsible: {
    name: _name,
    phone: _phoneNumber.replace(/\D/g, ''),
    cellphone: _phoneNumber.replace(/\D/g, ''),
    email: faker.internet.email(),
    password: '123456'
  },
  active: true
}
const makeDataMock = (email, cnpj, userActive) => {
  return {
    sold_by: faker.name.findName(),
    document: cnpj.replace(/\D/g, ''),
    responsible: {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber().replace(/\D/g, ''),
      cellphone: faker.phone.phoneNumber().replace(/\D/g, ''),
      email: email,
      password: '123456'
    },
    active: userActive
  }
}
module.exports = {
  mockPreRegister,
  makeDataMock
}
