const dynamoClient = require('./dynamo')
const esClient = require('./elastic')
const mongooseConnection = require('./mongo')
const s3 = require('./s3')

module.exports = {
  dynamoClient,
  esClient,
  mongooseConnection,
  s3,
}