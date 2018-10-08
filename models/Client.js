const mongoose = require('mongoose')

const SCOPES = [
  'admin',
  'aggregate',
  'basic',
  'download',
]

const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    index: true,
    unique: true,
  },
  apiKeys: [{
    value: {
      type: String,
      index: true,
      unique: true,
    },
    scopes: [{
      type: String,
      enum: SCOPES,
    }],
  }],
}, {
  timestamps : true
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client