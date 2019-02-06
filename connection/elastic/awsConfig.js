const AWS = require('aws-sdk')
const config = require('../../config')

const accessKeyId = process.env.CHARITY_BASE_ES_AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.CHARITY_BASE_ES_AWS_SECRET_ACCESS_KEY

const awsConfig = new AWS.Config({
  region: config.elastic.region,
})

if (accessKeyId && secretAccessKey) {
  awsConfig.update({
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  })
}

module.exports = awsConfig