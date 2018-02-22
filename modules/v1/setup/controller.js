const rfr = require('rfr')
const actionsPath = './actions/'
const extend = require('extend')
const Model = require('./model').model

const controllerActions = {}

// Import default actions
const importActions = ['find', 'findById', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const arrayToObject = (array) => {
  return array.reduce((obj, item) => {
    obj[item.key] = item.value
    return obj
  }, {})
}

// Controller custom actions
const customMethods = {
  /**
   * Searches and fetches the resource in database
   * @method find
   * @param  {Request} req Express Request Object
   * @param  {Response} res Express Response Object
   * @return {Boolean}     Wheter the response was sent or not
   */
  find: (req, res) => {
    Model
      .findOne({})
      .exec((err, data) => {
        if (err || !(data)) throw err
        let payload = data.data

        if (!req.query.full) {
          payload = arrayToObject(data.data)
        }

        res.status(200).json(payload)
      })
  },
  create: (req, res) => {
    const mod = req.body

    Model
      .findOne({})
      .exec((err, modelInstance) => {
        if (err) throw err

        modelInstance.data.push(mod)
        modelInstance.save((error, document) => {
          if (error) throw error

          const payload = document.data.find(s => s.key === mod.key)
          res.status(201).json(payload)
        })
      })
  },
  update: (req, res) => {
    console.log(`Chegou no update`)
    const mod = req.body

    Model.findOneAndUpdate({}, {$set: mod}, {new: true}, (err, modelInstance) => {
      if (err) throw err
      if (!modelInstance) res.status(404).json({error: 'setup_not_found'})

      modelInstance
        .populate('last_updated_by', (err, setup) => {
          if (err) throw err
          res.status(200).json(setup)
        })
    })
  },
  checkExists: (req, res) => {
    Model
      .count({data: {$elemMatch: req.body}})
      .exec((err, value) => {
        if (err) throw err
        res.status(200).json({exists: !!(value >= 1)})
      })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
