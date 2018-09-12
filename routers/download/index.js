const fs = require('fs')
const zlib = require('zlib')
const downloadCharitiesRouter = require('express').Router()
const log = require('../../helpers/logger')
const ElasticStream = require('../../helpers/elasticStream')
const { parserCSV, parserJSON } = require('./parser')

const DOWNLOADS_DIR = './downloads'

try {
  fs.mkdirSync(DOWNLOADS_DIR)
} catch (e) {}


const getFileName = (queryParams, fileType) => {
  const fileExtension = fileType === 'JSON' ? 'jsonl' : 'csv'
  const { sort, limit, skip, frozen, view, ...filters } = queryParams
  const filterNames = Object.keys(filters)
  if (filterNames.length === 0) {
    return `all.${fileExtension}.gz`
  }
  return `${filterNames.reduce((agg, x) => `${agg}_${x}=${filters[x]}`, '')}.${fileExtension}.gz`
}

const handleError = err => {
  log.error(err)
  // Handle error, but keep in mind the response may be partially-sent
  // so check res.headersSent
  fs.unlink(filePath, e => {
    if (e) {
      return log.error(e)
    }
    log.info(`Successfully deleted ${filePath}`)
  })
}

const getDownloadCharitiesRouter = (esClient, esIndex) => {

  downloadCharitiesRouter.post('/', (req, res, next) => {

    const { query } = res.locals.elasticSearch

    const searchParams = {
      index: esIndex,
      size: 500,
      body: { query },
      scroll: '1m',
    }

    const { fileType } = req.body
    
    const fileName = getFileName(req.query, fileType)
    const filePath = `${DOWNLOADS_DIR}/${fileName}`

    fs.stat(filePath, (err, stats) => {
      // TODO: check file is not currently being writted
      if (stats && stats.isFile()) {
        return res.download(filePath, fileName)
      } else {
        const parser = fileType === 'JSON' ? parserJSON : parserCSV
        const eStream = new ElasticStream({ searchParams, client: esClient, parser })
        eStream.on('error', handleError)
        const gzip = zlib.createGzip()
        gzip.on('error', handleError)
        const readableGzip = eStream.pipe(gzip)
        readableGzip.on('error', handleError)

        const out = fs.createWriteStream(filePath)
        readableGzip.pipe(out)
        log.info(`Writing to file: ${filePath}`)

        res.attachment(fileName)
        readableGzip.pipe(res)
      }
    })

  })

  return downloadCharitiesRouter
}

module.exports = getDownloadCharitiesRouter
