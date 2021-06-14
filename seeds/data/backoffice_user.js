const rfr = require('rfr')
const { generateUser } = require('../faker')

const RoleModel = rfr('/models/backoffice_role').model

const getFakeData = async (amount) => {
  return Promise.all(Array.from(Array(amount), () => generateUser()))
}

const getCustomUsers = (admin) => {
  return [
    {
      email: 'fulano@i9xp.com.br',
      name: 'Fulano Beltrano',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'natalia.camarotto@i9xp.com.br',
      name: 'Natalia Camarotto',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'helio.trida@i9xp.com.br',
      name: 'Helio Trida',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'julio.gregio@i9xp.com.br',
      name: 'Julio Gregio',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'kemilly.santos@i9xp.com.br',
      name: 'Kemilly Santos',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'vivian.andrade@i9xp.com.br',
      name: 'Vivian Andrade',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'henrique.andrade@i9xp.com.br',
      name: 'Henrique Andrade',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'wisney.cardeal@i9xp.com.br',
      name: 'Wisney Cardeal',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'thiago.abreu@i9xp.com.br',
      name: 'Thiago Abreu',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'marcus.novais@i9xp.com.br',
      name: 'Marcus Novais',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'larissa.giffony@i9xp.com.br',
      name: 'Larissa Giffony',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'igor@i9xp.com.br',
      name: 'Igor Pfeilsticker',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'edson@i9xp.com.br',
      name: 'Edson Tavaes',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'pedro.koiffman@i9xp.com.br',
      name: 'Pedro Koiffman',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'marionbxcz@gmail.com',
      name: 'Mario Sergio',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'lucasfsduarte@gmail.com',
      name: 'Lucas Duarte',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'vitorluisgs@gmail.com',
      name: 'Vitor Luis',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'lucasoaresgomes@gmail.com',
      name: 'Lucas Soares',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'aleson.franca@i9xp.com.br',
      name: 'Aleson Franca',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'ana.meneses@i9xp.com.br',
      name: 'Ana Meneses',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'henrique.andrade@i9xp.com.br',
      name: 'Henrique Andrade',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'jefferson.franca@i9xp.com.br',
      name: 'Jefferson Franca',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'lucius.gaitan@i9xp.com.br',
      name: 'Lucius Gaitan',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    {
      email: 'rodrigo.costa@i9xp.com.br',
      name: 'Rodrigo Costa',
      password: 'Secret@123',
      active: true,
      role: admin._id
    }
  ]
}

const data = async (production) => {
  const admin = await RoleModel.findOne({ name: 'admin' })
  if (!admin) throw new Error('Admin role not found!')

  const fakeData = (!production) ? await getFakeData(8) : []
  const customUsers = (!production) ? getCustomUsers(admin) : []

  return [
    {
      email: 'gustavo.viegas@i9xp.com.br',
      name: 'Gustavo Viegas',
      password: 'Secret@123',
      active: true,
      role: admin._id
    },
    ...fakeData,
    ...customUsers
  ]
}

module.exports = data
