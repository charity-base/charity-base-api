const AWS = require('aws-sdk')
const config = require('../../config')

const accessKeyId = process.env.CHARITY_BASE_S3_DOWNLOADS_ACCESS_KEY_ID
const secretAccessKey = process.env.CHARITY_BASE_S3_DOWNLOADS_SECRET_ACCESS_KEY

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey)

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: config.s3.region,
  credentials,
})

module.exports = s3