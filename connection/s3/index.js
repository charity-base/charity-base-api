const AWS = require("aws-sdk")

const {
  CHARITY_BASE_S3_DOWNLOADS_ACCESS_KEY_ID,
  CHARITY_BASE_S3_DOWNLOADS_SECRET_ACCESS_KEY,
  CHARITY_BASE_S3_REGION,
} = process.env

const credentials = new AWS.Credentials(
  CHARITY_BASE_S3_DOWNLOADS_ACCESS_KEY_ID,
  CHARITY_BASE_S3_DOWNLOADS_SECRET_ACCESS_KEY
)

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: CHARITY_BASE_S3_REGION,
  credentials,
})

module.exports = s3
