const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const apiRouter = require('./routers')
const config = require('./config.json')
const mongoose = require('mongoose')
const log = require('./helpers/logger')

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

const mongoUser = process.env.CHARITY_BASE_MONGO_ATLAS_USER
const mongoPassword = process.env.CHARITY_BASE_MONGO_ATLAS_PASSWORD

const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${config.mongo.host}/`

mongoose.connect(mongoUri, {
  dbName: config.mongo.dbName,
  useCreateIndex: true,
  useNewUrlParser: true,
  autoIndex: true,
}).then(() => {
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use('/api/:version/', apiRouter(config.version, config.elastic, config.jwt))
  app.listen(listenPort, () => {
    log.info(`Listening on port ${listenPort}`)
  })
}).catch(err => {
  log.error(err)
  process.exit(1)
})

process.on('uncaughtException', err => {
  log.error(err)
  process.exit(1)
})
