const esClient = require('./elastic')
const mongooseConnection = require('./mongo')

module.exports = {
  esClient,
  mongooseConnection,
}