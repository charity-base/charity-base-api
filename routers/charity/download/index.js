const zlib = require('zlib')
const downloadCharitiesRouter = require('express').Router()
const log = require('../../../helpers/logger')
const ElasticStream = require('../../../helpers/elasticStream')
const { getAllowedCSVFieldPaths, getFileName, csvHeader } = require('./helpers')
const getParser = require('./parser')
const { s3 } = require('../../../connection')

const bucket = 'charity-base-uk-downloads'
const folder = 'downloads'
const linkExpiresSeconds = 15*60

const getDownloadCharitiesRouter = (esClient, esIndex) => {

  downloadCharitiesRouter.post('/', (req, res, next) => {

    const { fileType } = req.body
    const { query, meta } = res.locals.elasticSearch

    const searchParams = {
      index: esIndex,
      size: 500,
      body: { query },
      scroll: '1m',
      _source: meta._source,
      sort: meta.sort,
    }

    const csvFields = fileType === 'CSV' && getAllowedCSVFieldPaths(meta._source)

    const fileName = getFileName(req.query, fileType)

    const s3Key = `${folder}/${fileName}`
    const s3KeyComplete = `${folder}/complete_${fileName}`

    let complete = false

    const getFileUrl = () => new Promise((resolve, reject) => {
      log.info('checking if upload exists')
      s3.waitFor('objectExists', {
        Bucket: bucket,
        Key: s3KeyComplete,
        $waiter: { maxAttempts: 0 },
      })
      .promise()
      .then(data => {
        log.info('complete upload exists, returning url')
        const url = s3
        .getSignedUrl('getObject', {
          Bucket: bucket,
          Key: s3KeyComplete,
          Expires: linkExpiresSeconds,
        })
        log.info(url)
        complete = true
        return resolve(url)
      })
      .catch(err => {
        if (complete) return
        // TODO: check error type.  it could be something else e.g. s3 auth error
        log.info('no upload found, so lets do it.')

        const eStream = new ElasticStream({
          searchParams,
          client: esClient,
          parser: getParser(fileType, csvFields),
        })
        // eStream.on('error', handleError(filePath))

        const gzip = zlib.createGzip()
        if (fileType === 'CSV') {
          gzip.write(csvHeader(csvFields))
        }
        // gzip.on('error', handleError(filePath))

        const readableGzip = eStream.pipe(gzip)

        const uploadPromise = s3
        .upload({
          Bucket: bucket,
          Key: s3Key,
          Body: readableGzip,
        })
        .promise()

        return uploadPromise
      })
      .then(data => {
        if (complete) return
        log.info('successfully uploaded to s3. lets copy to new file with _complete appended to name.')
        // Note: copyObject requires permission: s3:GetObject, s3:PutObject, s3:GetObjectTagging, s3:PutObjectTagging
        return s3.copyObject({
          Bucket: bucket,
          CopySource: `${bucket}/${s3Key}`,
          Key: s3KeyComplete,
        })
        .promise()
      })
      .then(data => {
        if (complete) return
        log.info('file copied. now lets delete the original, but not too bothered if it fails')
        s3
        .deleteObject({
          Bucket: bucket,
          Key: s3Key,
        })
        .promise()

        return
      })
      .then(() => {
        if (complete) return
        log.info('returning url of newly uploaded file')
        const url = s3
        .getSignedUrl('getObject', {
          Bucket: bucket,
          Key: s3KeyComplete,
          Expires: linkExpiresSeconds,
        })
        log.info(url)
        complete = true
        return resolve(url)
      })
      .catch(err => {
        if (complete) return
        log.info('oops something went wrong')
        log.error(err, err.stack)
        complete = true
        return reject({ message: err.message })
      })
    })

    getFileUrl()
    .then(url => {
      res.json({ url })
    })
    .catch(err => {
      res.status(400).json({ message: err.message })
    })

  })

  return downloadCharitiesRouter
}

module.exports = getDownloadCharitiesRouter
