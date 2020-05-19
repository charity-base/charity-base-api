const esClient = require("./elastic")
const dynamoClient = require("./dynamo")
const s3 = require("./s3")

module.exports = {
  esClient,
  dynamoClient,
  s3,
}
