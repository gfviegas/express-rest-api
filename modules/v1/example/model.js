const mongoose = require('mongoose')
const modelName = 'example'

const structure = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}

const options = {
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
