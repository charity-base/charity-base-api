const AWS = require('aws-sdk')

const {
  CHARITY_BASE_DYNAMO_ACCESS_KEY_ID,
  CHARITY_BASE_DYNAMO_REGION,
  CHARITY_BASE_DYNAMO_SECRET_ACCESS_KEY,
  CHARITY_BASE_DYNAMO_TABLE_AUTH_KEYS,
} = process.env

const credentials = new AWS.Credentials(
  CHARITY_BASE_DYNAMO_ACCESS_KEY_ID,
  CHARITY_BASE_DYNAMO_SECRET_ACCESS_KEY
)

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  credentials,
  params: {
    TableName: CHARITY_BASE_DYNAMO_TABLE_AUTH_KEYS,
  },
  region: CHARITY_BASE_DYNAMO_REGION,
})

module.exports = dynamodb
