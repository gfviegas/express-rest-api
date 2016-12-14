const path = require('path')
const actionsPath = path.join(global._base, 'actions/')
const model = require('./model').model
const extend = require('extend')

const controllerActions = {}

// Import default actions
const importActions = ['create', 'find', 'findById', 'findOneAndUpdate', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = require(actionsPath + element)(model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  test: (req, res) => {
    console.log('called controller function test!')
    res.status(200).json({testRan: true})
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
