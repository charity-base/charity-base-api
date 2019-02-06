const elasticsearch = require('elasticsearch')
const awsConnector = require('http-aws-es')
const awsConfig = require('./awsConfig')
const config = require('../../config')

const esClient = new elasticsearch.Client({
  host: config.elastic.host,
  connectionClass: awsConnector,
  awsConfig,
})

module.exports = esClient
