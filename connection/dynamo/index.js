const AWS = require('aws-sdk')
const config = require('../../config')

const accessKeyId = process.env.CHARITY_BASE_DYNAMO_ACCESS_KEY_ID
const secretAccessKey = process.env.CHARITY_BASE_DYNAMO_SECRET_ACCESS_KEY

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey)

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  credentials,
  params: {
    TableName: config.dynamo.table,
  },
  region: config.dynamo.region,
})

module.exports = dynamodb
