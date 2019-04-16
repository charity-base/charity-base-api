const mongoose = require('mongoose')

const hitSchema = new mongoose.Schema({
  apiKey: String,
  url: String,
  version: String,
  user: { },
  query: { },
}, {
  timestamps : true
})

const Hit = mongoose.model('Hit', hitSchema)

module.exports = Hit