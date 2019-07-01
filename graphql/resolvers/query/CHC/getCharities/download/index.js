const zlib = require('zlib')
const crypto = require('crypto')
const { PassThrough } = require('stream')
const { Transform } = require('json2csv')
const config = require('../../../../../../config.json')
const { log } = require('../../../../../../helpers')
const { esClient, s3 } = require('../../../../../../connection')
const getElasticQuery = require('../elastic-query')
const ElasticStream = require('./elastic-stream')

const BUCKET = 'charity-base-uk-downloads'
const FOLDER = 'downloads'
const LINK_EXPIRES_SECONDS = 24*60*60

const NUM_SLICES = 5
const CHUNK_SIZE = 10000
const SOURCE = [
  'ids.GB-CHC',
  'companiesHouseNumber',
  'name',
  'website',
  'people.trustees',
  'people.employees',
  'people.volunteers',
  'lastRegistrationDate',
  'financial.latest.financialYear.end',
  'financial.latest.income',
  'financial.latest.spending',
  'contact.email',
  'contact.phone',
  'contact.address',
  'contact.postcode',
  'contact.geo.parliamentary_constituency',
  'contact.geo.codes.parliamentary_constituency',
  'contact.geo.latitude',
  'contact.geo.longitude',
]

const searchParams = (query, sliceId) => ({
  index: [config.elastic.indexes.chc.charities],
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

const fileName = filters => {
  const idString = JSON.stringify(filters) + SOURCE.join('')
  const hash = crypto.createHash('md5').update(idString).digest('hex')
  return `CharityBase_${hash}.csv.gz`
}

const downloadCharities = (filters) => {
  return new Promise(async (resolve, reject) => {
    const path = fileName(filters)
    log.info(`Attempting upload: "${path}"`)

    const s3Params = {
      Bucket: BUCKET,
      Key: `${FOLDER}/${path}`,
    }

    try {
      const head = await s3.headObject(s3Params).promise() // checks if file exists (throws error if not)
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      log.info('File already uploaded')
      return resolve({
        url,
        size: head.ContentLength,
      })
    } catch (e) {
      log.info('Could not find existing file matching that query')
    }

    try {
      await s3.headObject({
        Bucket: BUCKET,
        Key: `${FOLDER}/attempt_${path}`,
      }).promise() // checks if upload in progress (throws error if not)
      log.info('File is already being uploaded.  Waiting for it to be ready.')
      const meta = await s3.waitFor('objectExists', s3Params).promise() // wait for upload to complete
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      log.info('File finished uploading')
      return resolve({
        url,
        size: meta.ContentLength,
      })
    } catch (e) {
      log.info('Could not find placeholder file matching that query.  We will do the upload ourselves.')
    }

    try {
      await s3.putObject({
        Bucket: BUCKET,
        Key: `${FOLDER}/attempt_${path}`,
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

    combinedStream.on('error', e => {
      log.error(e)
      reject(e)
      // uploading code will still run :(
      s3.deleteObject(s3Params).promise()
    })

    const json2csv = new Transform({
      fields: SOURCE,
      unwind: ['contact.social'],
      unwindBlank: true,
    }, {
      // highWaterMark: 16384,
      encoding: 'utf-8',
      objectMode: true,
    })

    const gzip = zlib.createGzip()

    try {
      log.info('Piping output to s3')
      const upload = await s3.upload({
        ...s3Params,
        Body: combinedStream.pipe(json2csv).pipe(gzip),
      }).promise()
      log.info('Successfully uploaded file')
      const url = s3.getSignedUrl('getObject', { ...s3Params, Expires: LINK_EXPIRES_SECONDS })
      const head = await s3.headObject(s3Params).promise()
      resolve({
        url,
        size: head.ContentLength,
      })
    } catch (e) {
      log.error('Failed to upload file')
      reject(e)
    }

    try {
      log.info('Deleting placeholder')
      s3.deleteObject({
        Bucket: BUCKET,
        Key: `${FOLDER}/attempt_${path}`,
      }).promise()
    } catch(e) {
      log.error('Failed to delete placeholder')
    }
  })
}

module.exports = downloadCharities
