const elasticsearch = require("elasticsearch")
const awsConnector = require("http-aws-es")
const awsConfig = require("./awsConfig")

const { CHARITY_BASE_ES_AWS_HOST } = process.env

const esClient = new elasticsearch.Client({
  host: CHARITY_BASE_ES_AWS_HOST,
  connectionClass: awsConnector,
  awsConfig,
})

module.exports = esClient
