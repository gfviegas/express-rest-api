const mongoose = require('mongoose')
const modelName = 'setup'

const structure = {
  data: [{
    label: {
      required: true,
      type: String
    },
    key: {
      unique: true,
      required: true,
      type: String
    },
    value: {
      required: true,
      type: String
    }
  }]
}

const options = {
  strict: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
