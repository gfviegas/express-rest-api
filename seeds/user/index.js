const data = [
  {
    email: 'gustavo@i9xp.com.br',
    username: 'gfviegas',
    name: 'Gustavo Viegas',
    password: 'secret',
    active: true,
    cpf: '01933606673',
    permissions: [
      {'resource': 'user', 'label': 'Usuários', 'value': ['view', 'manage']},
      {'resource': 'setup', 'label': 'Configurações', 'value': ['view', 'manage']}
    ]
  }
]

module.exports = data
