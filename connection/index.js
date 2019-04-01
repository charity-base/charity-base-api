const esClient = require('./elastic')
const dynamoClient = require('./dynamo')
const mongooseConnection = require('./mongo')
const s3 = require('./s3')

module.exports = {
  esClient,
  dynamoClient,
  mongooseConnection,
  s3,
}