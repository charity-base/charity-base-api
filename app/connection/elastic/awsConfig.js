const AWS = require("aws-sdk")

const {
  CHARITY_BASE_ES_AWS_ACCESS_KEY_ID,
  CHARITY_BASE_ES_AWS_SECRET_ACCESS_KEY,
  CHARITY_BASE_ES_AWS_REGION,
} = process.env

const awsConfig = new AWS.Config({
  region: CHARITY_BASE_ES_AWS_REGION,
})

awsConfig.update({
  credentials: new AWS.Credentials(
    CHARITY_BASE_ES_AWS_ACCESS_KEY_ID,
    CHARITY_BASE_ES_AWS_SECRET_ACCESS_KEY
  ),
})

module.exports = awsConfig
