const mongoose = require('mongoose')
const modelName = 'user'

const structure = {
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true,
    select: false
  },
  permissions: [{
    label: {
      required: true,
      type: String
    },
    resource: {
      required: true,
      type: String
    },
    value: [{
      type: String
    }]
  }],
  passwordToken: {
    type: String,
    required: false,
    select: false
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
}

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
schema.plugin(require('mongoose-bcrypt'), {rounds: 10})

const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
