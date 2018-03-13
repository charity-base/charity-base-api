const fs = require('fs')
const log = require('../helpers/logger')
const charitiesFileRouter = require('express').Router()
const Charity = require('../models/charity')

const DOWNLOADS_DIR = './downloads'

try {
  fs.mkdirSync(DOWNLOADS_DIR)
} catch (e) {}

const getDownloadCharitiesRouter = () => {

  charitiesFileRouter.get('/', (req, res, next) => {

    const { filter } = res.locals.query

    const query = {
      url: req.url,
      filter,
    }
    
    const fileName = `${req.url.replace(/\//g, '') || 'all'}.txt`
    const filePath = `${DOWNLOADS_DIR}/${fileName}`
    res.locals.filePath = filePath
    log.info(`File path: ${filePath}`)

    const writeStreamOptions = {
      flags: 'a'
    }

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        log.info(`File ${fileName} already exists`)
        return next()
      }

      log.info(`Creating file ${fileName}`)
      
      fs.writeFile(filePath, `${JSON.stringify(query)}\n`, err => {
        if (err) {
          log.error(err)
          return res.sendStatus(400)
        }
        const writeStream = fs.createWriteStream(filePath, writeStreamOptions)
        const mongooseCursor = Charity.find(filter).limit(1000).cursor({ transform: x => `${JSON.stringify(x)}\n` })

        mongooseCursor.pipe(writeStream).on('finish', () => {
          log.info("Write stream finished")
          next()
        })
      })

    })
  })

  charitiesFileRouter.get('/', (req, res, next) => {
    const { filePath } = res.locals
    const sendFileOptions = {}

    res.download(filePath, 'charity-base-download.txt', sendFileOptions, err => {
      if (err) {
        log.error(err)
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        log.info(`Successfully sent file ${filePath}`)
        // decrement a download credit, etc.
      }
    })
  })

  return charitiesFileRouter
}

module.exports = getDownloadCharitiesRouter
