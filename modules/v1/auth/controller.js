const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('../user/model').model
const extend = require('extend')
const mailer = rfr('helpers/mail')
const jwtHelper = rfr('helpers/jwt')

const controllerActions = {}

// Import default actions
const importActions = []
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  fetch: (req, res) => {
    Model
      .findById(jwtHelper.getUserId(req), (err, data) => {
        if (err) throw err

        if (!data) return res.status(404).json()
        if (!data.active) return res.status(403).json({error: 'user_inactive'})

        res.json(data)
      })
  },
  authenticate: (req, res) => {
    const query = {$or: [{username: req.body.username}, {email: req.body.username}]}
    Model.findOne(query)
      .select('+password')
      .exec((err, user) => {
        if (err) throw err

        if (!user) {
          return res.status(404).json({error: 'user_not_found'})
        } else if (!user.active) {
          return res.status(403).json({error: 'user_inactive'})
        } else {
          user.verifyPassword(req.body.password, (err, valid) => {
            if (err) throw err

            if (!valid) {
              return res.status(422).json({error: 'wrong_credentials'})
            } else {
              return res.status(200).json({token: jwtHelper.generateToken(user)})
            }
          })
        }
      })
  },
  resetPassword: (req, res) => {
    req.connection.setTimeout(1000 * 60 * 10)
    const query = { email: req.body.email }
    Model
      .findOne(query)
      .exec((err, user) => {
        if (err) throw err

        if (!user) {
          res.status(404).json({error: 'user_not_found'})
        } else {
          user['passwordToken'] = Math.random().toString(35).substr(2, 20).toUpperCase()

          user.save((error) => {
            if (error) throw error

            const options = {
              to: user['email'],
              subject: 'Alteração de Senha',
              template: {
                path: 'auth/reset-password',
                data: user.toObject()
              }
            }

            console.log(JSON.stringify(options))
            return mailer.sendMail(options)
              .then(response => {
                res.status(204).json()
              })
              .catch(response => {
                res.status(500).json(response)
              })
          })
        }
      })
  },
  findByPasswordToken: (req, res) => {
    const query = {passwordToken: req.params.token}
    Model
      .findOne(query, (err, data) => {
        if (err) throw err

        if (!data) {
          res.status(404).json({error: 'user_not_found'})
        } else {
          res.status(200).json(data)
        }
      })
  },
  updatePassword: (req, res) => {
    const query = {passwordToken: req.params.token}
    Model
      .findOne(query, (err, user) => {
        if (err) throw err

        if (!user) {
          res.status(404).json({error: 'user_not_found'})
        } else {
          user['passwordToken'] = undefined
          user['password'] = req.body.password
          user.save((error) => {
            if (error) throw error

            res.status(204).json()

            const options = {
              to: user['email'],
              subject: 'Senha Atualizada',
              template: {
                path: 'auth/updated-password',
                data: user.toObject()
              }
            }

            return mailer.sendMail(options)
          })
        }
      })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
