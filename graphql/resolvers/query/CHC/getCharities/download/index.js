const archiver = require('archiver')
const stream = require('stream')
const crypto = require('crypto')
const { PassThrough } = require('stream')
const { Transform } = require('json2csv')
const { log } = require('../../../../../../helpers')
const { esClient, s3 } = require('../../../../../../connection')
const getElasticQuery = require('../elastic-query')
const ElasticStream = require('./elastic-stream')

const {
  CHARITY_BASE_ES_AWS_INDEX_CHC_CHARITY,
  CHARITY_BASE_S3_DOWNLOADS_BUCKET,
  CHARITY_BASE_S3_DOWNLOADS_PATH,
} = process.env

const LINK_EXPIRES_SECONDS = 24*60*60
const FILE_PREFIX = 'CharityBase'

const NUM_SLICES = 5
const CHUNK_SIZE = 10000
const SOURCE = [
  'chcId',
  'cohId',
  'primaryName',
  'website',
  'numPeople.trustees',
  'numPeople.employees',
  'numPeople.volunteers',
  'lastRegistrationDate',
  'finances.latest.financialYear.end',
  'finances.latest.income',
  'finances.latest.spending',
  'contact.email',
  'contact.phone',
  'contact.address',
  'contact.postcode',
  'social.facebook',
  'social.twitter',
  // 'contact.geo.parliamentary_constituency',
  // 'contact.geo.codes.parliamentary_constituency',
  'postcodeGeo.names.ccg',
  // 'postcodeGeo.names.cty',
  'postcodeGeo.names.eer',
  'postcodeGeo.names.laua',
  'postcodeGeo.names.lsoa11',
  'postcodeGeo.names.msoa11',
  'postcodeGeo.names.pcon',
  'postcodeGeo.names.ru11ind',
  'postcodeGeo.names.ttwa',
  'postcodeGeo.names.ward',
  'postcodeGeo.coordinates.lat',
  'postcodeGeo.coordinates.lon',
]

const searchParams = (query, sliceId) => ({
  index: [CHARITY_BASE_ES_AWS_INDEX_CHC_CHARITY],
  body: {
    query: query,
    slice: {
      id: sliceId,
      max: NUM_SLICES,
    },
  },
  _source: SOURCE,
  scroll: '1m',
  size: CHUNK_SIZE,
})

const fileName = (filters) => {
  const idString = JSON.stringify(filters) + SOURCE.join('')
  const hash = crypto.createHash('md5').update(idString).digest('hex')
  return `${FILE_PREFIX}_${hash}`
}

const downloadCharities = (filters) => {
  return new Promise(async (resolve, reject) => {
    const path = `${fileName(filters)}.zip`
    log.info(`Attempting upload: "${path}"`)

    const s3Params = {
      Bucket: CHARITY_BASE_S3_DOWNLOADS_BUCKET,
      Key: `${CHARITY_BASE_S3_DOWNLOADS_PATH}/${path}`,
    }

    try {
      const head = await s3.headObject(s3Params).promise() // checks if file exists (throws error if not)
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      log.info('File already uploaded')
      return resolve({
        url,
        size: head.ContentLength,
        name: path,
      })
    } catch (e) {
      log.info('Could not find existing file matching that query')
    }

    try {
      await s3.headObject({
        Bucket: CHARITY_BASE_S3_DOWNLOADS_BUCKET,
        Key: `${CHARITY_BASE_S3_DOWNLOADS_PATH}/attempt_${path}`,
      }).promise() // checks if upload in progress (throws error if not)
      log.info('File is already being uploaded.  Waiting for it to be ready.')
      const meta = await s3.waitFor('objectExists', s3Params).promise() // wait for upload to complete
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      log.info('File finished uploading')
      return resolve({
        url,
        size: meta.ContentLength,
        name: path,
      })
    } catch (e) {
      log.info('Could not find placeholder file matching that query.  We will do the upload ourselves.')
    }

    try {
      await s3.putObject({
        Bucket: CHARITY_BASE_S3_DOWNLOADS_BUCKET,
        Key: `${CHARITY_BASE_S3_DOWNLOADS_PATH}/attempt_${path}`,
        Body: '',
      }).promise() // let the world know we're uploading
      log.info('Successfully uploaded a placeholder file')
    } catch (e) {
      throw new Error('Failed to upload a placeholder file')
    }

    log.info('Starting Elasticsearch query')
    
    const query = getElasticQuery(filters)

    const streams = [...Array(NUM_SLICES)].map((_, i) => (
      new ElasticStream({
        objectMode: true,
        searchParams: searchParams(query, i),
        client: esClient,
      })
    ))
    const combinedStream = streams.reduce((agg, x) => x.pipe(agg, { end: false }), new PassThrough({ objectMode: true, }))
    
    let waitingStreams = NUM_SLICES
    streams.forEach((x, i) => {
      x.on('error', e => {
        combinedStream.emit('error', e)
      })
      x.once('end', () => {
        --waitingStreams === 0 && combinedStream.emit('end') // end combined stream once all streams ended
      })
    })

    combinedStream.on('error', async e => {
      log.error(e)
      // Delete file
      try {
        await s3.deleteObject(s3Params).promise()
      } catch (delErr) {}
      // Delete placeholder
      try {
        await s3.deleteObject({
          Bucket: CHARITY_BASE_S3_DOWNLOADS_BUCKET,
          Key: `${CHARITY_BASE_S3_DOWNLOADS_PATH}/attempt_${path}`,
        }).promise()
      } catch (delErr) {}
      reject(e)
      // will s3.upload still run?
    })

    const json2csv = new Transform({
      fields: SOURCE,
      unwindBlank: true,
    }, {
      // highWaterMark: 16384,
      encoding: 'utf-8',
      objectMode: true,
    })

    try {
      log.info('Piping output to s3')

      const zippedStream = new stream.Transform({
        transform: (chunk, encoding, callback) => {
          callback(null, chunk) // callback(<error>, <result>)
        }
      })
      const zip = archiver('zip')
      zip.pipe(zippedStream)
      zip.append(
        combinedStream.pipe(json2csv),
        { name: `${fileName(filters)}.csv` } // name of the unzipped file
      )
      // todo: handle append and zippedStream warnings & errors
      zip.finalize()

      const upload = await s3.upload({
        ...s3Params,
        Body: zippedStream,
      }).promise()
      log.info('Successfully uploaded file')
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      const head = await s3.headObject(s3Params).promise()
      resolve({
        url,
        size: head.ContentLength,
        name: path,
      })
    } catch (e) {
      log.error('Failed to upload file')
      // todo: delete placeholder & file
      reject(e)
    }

    try {
      log.info('Deleting placeholder')
      s3.deleteObject({
        Bucket: CHARITY_BASE_S3_DOWNLOADS_BUCKET,
        Key: `${CHARITY_BASE_S3_DOWNLOADS_PATH}/attempt_${path}`,
      }).promise()
    } catch(e) {
      log.error('Failed to delete placeholder')
    }
  })
}

module.exports = downloadCharities
