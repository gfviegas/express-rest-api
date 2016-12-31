const rfr = require('rfr')
const actionsPath = './actions/'
const model = require('./model').model
const extend = require('extend')

const controllerActions = {}

// Import default actions
const importActions = ['create', 'find', 'findById', 'findOneAndUpdate', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  test: (req, res) => {
    res.status(200).json({tested: true})
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
