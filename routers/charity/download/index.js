const zlib = require('zlib')
const downloadCharitiesRouter = require('express').Router()
const log = require('../../../helpers/logger')
const ElasticStream = require('../../../helpers/elasticStream')
const { getAllowedCSVFieldPaths, getFileName, csvHeader } = require('./helpers')
const getParser = require('./parser')
const { s3 } = require('../../../connection')
const { PassThrough } = require('stream')
const config = require('../../../config.json')

const bucket = 'charity-base-uk-downloads'
const folder = 'downloads'
const linkExpiresSeconds = 15*60

// const EventEmitter = require('events')
// EventEmitter.defaultMaxListeners = 20
const numSlices = 30

const BASE_URL = process.env.NODE_ENV === 'production' ? config.prodBaseUrl : 'http://localhost:4000'

// const mergeStreams = streams => {
//   let pass = new PassThrough()
//   let waiting = streams.length
//   for (let stream of streams) {
//     pass = stream.pipe(pass, {end: false})
//     stream.once('end', () => --waiting === 0 && pass.emit('end'))
//   }
//   return pass
// }

const fetch = require('node-fetch')

const getStreamUrl = req => {
  const urlList = req.originalUrl.split('/')
  const streamUrlList = [
    ...urlList.slice(0,urlList.length-1),
    'upload-slice',
    ...urlList.slice(urlList.length-1),
  ]
  return `${BASE_URL}${streamUrlList.join('/')}`
}

const getDownloadCharitiesRouter = (esClient, esIndex) => {

  downloadCharitiesRouter.post('/upload-slice', async function(req, res, next) {
    const { searchParams, fileType, csvFields, key } = req.body
    const myStream = new ElasticStream({
      searchParams,
      client: esClient,
      parser: getParser(fileType, csvFields),
    })

    // TODO: zip before sending
    const gzip = zlib.createGzip()
    if (fileType === 'CSV') {
      gzip.write(csvHeader(csvFields))
    }

    // res.attachment('tempfile')
    // myStream.pipe(gzip).pipe(res)

    try {
      const upload = await s3.upload({
        Body: myStream.pipe(gzip),
        Bucket: bucket,
        Key: key,
      }).promise()
      log.info(`succesfully uploaded key ${key}`)
      log.info(Object.keys(upload))
      return res.status(201).json({ ...upload })
    } catch (e) {
      log.info(`failed to upload key ${key}`)
      log.error(e)
      return res.sendStatus(400)
    }

  })

  downloadCharitiesRouter.post('/', (req, res, next) => {

    const { fileType } = req.body
    const { query, meta } = res.locals.elasticSearch

    const searchParams = sliceId => ({
      index: esIndex,
      size: 8000,
      body: {
        query,
        "slice": {
          "field": "ids.GB-CHC",
          "id": sliceId,
          "max": numSlices,
        },
      },
      scroll: '1m',
      _source: meta._source,
      // sort: meta.sort,
    })

    const csvFields = fileType === 'CSV' && getAllowedCSVFieldPaths(meta._source)

    const fileName = getFileName(req.query, fileType)

    const s3SliceKey = sliceId => `${folder}/slice_${sliceId}_${fileName}`
    const s3CompleteQueryKey = `${folder}/complete_query_${fileName}`

    let complete = false

    const getFileUrl = () => new Promise((resolve, reject) => {
      log.info('checking if upload exists')
      s3.getObject({
        Bucket: bucket,
        Key: s3CompleteQueryKey,
      })
      .promise()
      .then(data => {
        const completeUploadInfo = JSON.parse(data.Body.toString())
        log.info('found complete upload info')
        log.info(completeUploadInfo)
        log.info(Object.keys(completeUploadInfo))
        if (!completeUploadInfo.s3Objects || completeUploadInfo.s3Objects.length === 0) return
        log.info(`found complete query, returning ${completeUploadInfo.s3Objects.length} urls`)
        // TODO: read slice keys from complete_query_ file and return all urls
        // const url = s3
        // .getSignedUrl('getObject', {
        //   Bucket: bucket,
        //   Key: s3KeyComplete(),
        //   Expires: linkExpiresSeconds,
        // })
        // log.info(url)
        const urls = completeUploadInfo.s3Objects.map((x, i) => (
          s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: x.Key,
            Expires: linkExpiresSeconds,
          })
        ))
        complete = true
        return resolve(urls)
      })
      .catch(err => {
        if (complete) return
        // TODO: check error type.  it could be something else e.g. s3 auth error
        log.info('no upload found, so lets do it.')
        return
        // return s3
        // .putObject({
        //   Bucket: bucket,
        //   Key: s3KeyProgress,
        //   Body: '',
        // })
        // .promise()
      })
      .then(async function() {
        if (complete) return
        log.info('uploading slices')

        // let uploadId
        // try {
        //   const multiUploadData = await s3.createMultipartUpload({
        //     Bucket: bucket,
        //     Key: s3KeyComplete,
        //   }).promise()
        //   uploadId = multiUploadData.UploadId
        // } catch(err) {
        //   s3.abortMultipartUpload({
        //     Bucket: bucket,
        //     Key: s3KeyComplete,
        //     UploadId: uploadId
        //   }).promise()
        //   return Promise.reject(err)
        // }

        // const slicedStreams = [...new Array(numSlices)].map((x, i) => (
        //   new ElasticStream({
        //     searchParams: searchParams(i),
        //     client: esClient,
        //     parser: getParser(fileType, csvFields),
        //   })
        // ))

        // log.info('successfully created multipart upload. uploading slices.')
        let slicedUploads
        try {
          slicedUploads = await Promise.all([...new Array(numSlices)].map((x, sliceId) => (
            fetch(getStreamUrl(req), {
              method: 'POST',
              body: JSON.stringify({
                searchParams: searchParams(sliceId),
                key: s3SliceKey(sliceId),
                fileType,
                csvFields,
              }),
              headers: {
                Authorization: req.headers.authorization,
                'Content-Type': 'application/json',
              }
            })
            .then(res => {
              log.info(`received status ${res.status} from sliceId ${sliceId}`)
              if (res.status !== 201) return Promise.reject({ message: 'Part of upload failed' })
              return res
            })
            .then(res => res.json())
          )))
        } catch (e) {
          return Promise.reject(e)
        }

        log.info('succesfully uploaded slices. uploading query info to complete file.')

        try {
          const upload = await s3.putObject({
            Bucket: bucket,
            Key: s3CompleteQueryKey,
            Body: JSON.stringify({
              query,
              meta,
              fileType,
              s3Objects: slicedUploads,
            }),
          }).promise()
          log.info('upload complete file')
        } catch (e) {
          log.info('failed to upload complete file')
          return Promise.reject(e)
        }

        log.info('successfully uploaded complete file. returning urls')
        try {

          const urls = slicedUploads.map((x, i) => (
            s3.getSignedUrl('getObject', {
              Bucket: bucket,
              Key: x.Key,
              Expires: linkExpiresSeconds,
            })
          ))
          log.info('signed urls')
          complete = true
          return resolve(urls)


          // const completeUpload = await s3.completeMultipartUpload({
          //   Bucket: bucket,
          //   Key: s3KeyComplete,
          //   UploadId: uploadId,
          //   MultipartUpload: {
          //     Parts: slicedUploads,
          //   },
          //   // RequestPayer: 'requester'
          // }).promise()
          // log.info('completeUpload')
          // log.info(completeUpload)
        } catch (e) {
          log.info('failed to sign urls')
          // s3.abortMultipartUpload({
          //   Bucket: bucket,
          //   Key: s3KeyComplete,
          //   UploadId: uploadId
          // }).promise()
          return Promise.reject(e)
        }



        // const eStream = mergeStreams(slicedStreams)
        // console.log('setting max listeners', slicedStreams[0].setMaxListeners(20))


        // const eStream = mergeStreams(slicedStreams)


        // eStream.on('error', handleError(filePath))

        // const gzip = zlib.createGzip()
        // if (fileType === 'CSV') {
        //   gzip.write(csvHeader(csvFields))
        // }
        // // gzip.on('error', handleError(filePath))

        // const readableGzip = eStream.pipe(gzip)

        // const uploadPromise = s3
        // .upload({
        //   Bucket: bucket,
        //   Key: s3Key,
        //   Body: eStream,
        // })
        // .promise()

        // return uploadPromise
      })
      // .then(data => {
      //   if (complete) return
      //   // log.info('Successfully completed multipart upload!')
      //   // Note: copyObject requires permission: s3:GetObject, s3:PutObject, s3:GetObjectTagging, s3:PutObjectTagging
      //   // return s3.copyObject({
      //   //   Bucket: bucket,
      //   //   CopySource: `${bucket}/${s3Key}`,
      //   //   Key: s3KeyComplete,
      //   // })
      //   // .promise()
      //   return data
      // })
      // .then(data => {
      //   if (complete) return
      //   log.info('file copied. now lets delete the original, but not too bothered if it fails')
      //   s3
      //   .deleteObject({
      //     Bucket: bucket,
      //     Key: s3Key,
      //   })
      //   .promise()

      //   return
      // })
      // .then(() => {
      //   if (complete) return
      //   log.info('returning url of newly uploaded file')
      //   const url = s3
      //   .getSignedUrl('getObject', {
      //     Bucket: bucket,
      //     Key: s3KeyComplete,
      //     Expires: linkExpiresSeconds,
      //   })
      //   log.info(url)
      //   complete = true
      //   return resolve(url)
      // })
      .catch(err => {
        if (complete) return
        log.info('oops something went wrong')
        log.error(err, err.stack)
        complete = true
        return reject({ message: err.message })
      })
    })

    getFileUrl()
    .then(urls => {
      res.json({ urls })
    })
    .catch(err => {
      res.status(400).json({ message: err.message })
    })

  })

  return downloadCharitiesRouter
}

module.exports = getDownloadCharitiesRouter
