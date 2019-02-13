const mongoose = require('mongoose')
const config = require('../../config.json')

const mongoUser = process.env.CHARITY_BASE_MONGO_ATLAS_USER
const mongoPassword = process.env.CHARITY_BASE_MONGO_ATLAS_PASSWORD

const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${config.mongo.host}/`

const mongooseConnection = mongoose.connect(mongoUri, {
  dbName: config.mongo.dbName,
  useCreateIndex: true,
  useNewUrlParser: true,
  autoIndex: true,
})

module.exports = mongooseConnection
