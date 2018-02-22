var express = require('express'),
    app = express(),
    cors = require('cors'),
    apiRouter = require('./routers'),
    config = require('./config.json'),
    connectToDb = require('./helpers/connectToDb');

connectToDb(config.dbUrl, {
  useMongoClient: true,
  autoIndex: true
})

app.use(cors())

app.use('/api/:version/', apiRouter(config.version))

const listenPort = process.env.PORT || 4000

app.listen(listenPort, () => {
  console.log(`Listening on port ${listenPort}.`)
})

process.on('uncaughtException', err => {
  console.log(err)
  process.exit(1)
})