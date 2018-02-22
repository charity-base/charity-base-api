const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./routers')
const config = require('./config.json')
const connectToDb = require('./helpers/connectToDb')

console.log(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

connectToDb(config.dbUrl, {
  useMongoClient: true,
  autoIndex: true
}).then(() => {
  app.use(cors())
  app.use('/api/:version/', apiRouter(config.version))
  app.listen(listenPort, () => {
    console.log(`Listening on port ${listenPort}.`)
  })
}).catch(err => {
  console.log(err)
  process.exit(1)
})

process.on('uncaughtException', err => {
  console.log(err)
  process.exit(1)
})
