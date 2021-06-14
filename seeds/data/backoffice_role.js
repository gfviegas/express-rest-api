const rfr = require('rfr')
const { generateRole } = require('../faker')

const allPermissions = rfr('/models/backoffice_role').permissions

const getFakeData = async (amount) => {
  return Promise.all(Array.from(Array(amount), () => generateRole()))
}

const data = async (production) => {
  const fakeData = (!production) ? await getFakeData(5) : []

  const permissions = allPermissions.map(p => {
    p.value = ['view', 'manage']
    return p
  })

  return [
    {
      name: 'admin',
      displayName: 'Administrador do Sistema',
      permissions
    },
    ...fakeData
  ]
}

module.exports = data
