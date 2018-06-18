const fs = require('fs')
const zlib = require('zlib')
const elasticsearch = require('elasticsearch')
const charitiesFileRouter = require('express').Router()
const log = require('../helpers/logger')
const ElasticStream = require('../helpers/elasticStream')

const DOWNLOADS_DIR = './downloads'

const client = new elasticsearch.Client({
  host: 'localhost:9200',
})


try {
  fs.mkdirSync(DOWNLOADS_DIR)
} catch (e) {}


const getFileName = queryParams => {
  const { sort, limit, skip, ...filters } = queryParams
  const filterNames = Object.keys(filters)
  if (filterNames.length === 0) {
    return 'all.jsonl.gz'
  }
  return `${filterNames.reduce((agg, x) => `${agg}_${x}=${filters[x]}`, '')}.jsonl.gz`
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

const getDownloadCharitiesRouter = () => {

  charitiesFileRouter.get('/', (req, res, next) => {

    const { query } = res.locals.elasticSearch

    const searchParams = {
      index: 'charitys',
      size: 500,
      body: { query },
      scroll: '1m',
    }
    
    const fileName = getFileName(req.query)
    const filePath = `${DOWNLOADS_DIR}/${fileName}`

    fs.stat(filePath, (err, stats) => {
      // TODO: check file is not currently being writted
      if (stats && stats.isFile()) {
        return res.download(filePath, fileName)
      } else {
        const eStream = new ElasticStream({ searchParams, client })
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

  return charitiesFileRouter
}

module.exports = getDownloadCharitiesRouter
