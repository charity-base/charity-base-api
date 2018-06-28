const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./routers')
const config = require('./config.json')
const connectToDb = require('./helpers/connectToDb')
const log = require('./helpers/logger')

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

const { dbHost, dbPort, dbName } = config.mongo

connectToDb(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
  useMongoClient: true,
  autoIndex: true
}).then(() => {
  app.use(cors())
  app.use('/api/:version/', apiRouter(config.version, config.elastic))
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
