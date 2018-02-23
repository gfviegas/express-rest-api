const data = [
  {
    email: 'example@example.com',
    username: 'exampleuser',
    name: 'John Doe',
    password: 'secret',
    active: true,
    permissions: [
      {'resource': 'user', 'label': 'Usuários', 'value': ['view', 'manage']},
      {'resource': 'setup', 'label': 'Configurações', 'value': ['view', 'manage']}
    ]
  }
]

module.exports = data
