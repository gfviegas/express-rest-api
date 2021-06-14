const rfr = require('rfr')
const faker = require('faker/locale/pt_BR')
const cnpj = require('@fnando/cnpj/dist/node')
const { checkpointEvents } = rfr('models/checkpoint')
const { model: BackofficeRoleModel, permissions: allPermissions } = rfr('models/backoffice_role')

faker.locale = 'pt_BR'
faker.seed(83)

exports.faker = faker

exports.generatePartner = async (custom) => {
  if (!custom) custom = {}
  const name = faker.company.companyName()

  return Object.assign({
    name,
    corporateName: name + faker.company.companySuffix(),
    cnpj: cnpj.generate(true),
    active: faker.random.boolean()
  }, custom)
}

exports.generateRole = async (custom) => {
  if (!custom) custom = {}
  const department = faker.commerce.department()
  const jobArea = faker.name.jobArea()
  const sufix = (faker.random.boolean()) ? `_${faker.company.bsNoun().split(' ')[0]}` : ''

  return Object.assign({
    name: `${department}_${jobArea}${sufix}`.toLowerCase(),
    displayName: `${jobArea} - ${department}`,
    permissions: allPermissions.map(p => {
      p.value = (faker.random.boolean()) ? ['view', 'manage'] : []
      return p
    })
  }, custom)
}

exports.generateUser = async (custom) => {
  if (!custom) custom = {}
  const roles = (await BackofficeRoleModel.find()).map(r => r._id)

  return Object.assign({
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: 'Secret@123',
    active: true,
    role: faker.random.arrayElement(roles)
  }, custom)
}

exports.generateProcessAverageTime = async (custom) => {
  if (!custom) custom = {}
  return Object.assign({
    reference: faker.date.recent(),
    average_days: Math.random()
  }, custom)
}

exports.generateSellerOverviewReport = async (custom) => {
  if (!custom) custom = {}
  return Object.assign({
    reference: faker.date.recent(),
    ongoing_sellers: faker.random.number({ min: 1000, max: 1500 }),
    new_sellers: faker.random.number({ min: 50, max: 80 }),
    activated_sellers: faker.random.number({ min: 20, max: 55 })
  }, custom)
}

exports.generateCheckpoint = async (custom, eventDate) => {
  if (!custom) custom = {}
  if (!eventDate) eventDate = new Date()

  const generateInternalCheckpoint = (custom) => {
    if (!custom) custom = {}

    const events = Object.values(checkpointEvents)

    return Object.assign({
      event: faker.random.arrayElement(events)
    }, custom)
  }

  return Object.assign({
    document: cnpj.generate(false),
    checkpoints: [...Array(Math.round(Math.random() * 10)).keys()].map(i => generateInternalCheckpoint({ created_at: eventDate }))
  })
}
