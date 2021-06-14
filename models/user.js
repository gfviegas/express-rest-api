const mongoose = require('mongoose')
const modelName = 'user'

const structure = {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true,
    select: false
  }
}

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
schema.plugin(require('mongoose-bcrypt'), { rounds: 10 })

const model = mongoose.model(modelName, schema)

module.exports = {
  schema,
  model
}
