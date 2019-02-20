require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const log = require('./helpers/logger')
const { mongooseConnection } = require('./connection')
const schema = require('./graphql')
const middleware = require('./middleware')

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

mongooseConnection.catch(err => {
  log.error(err)
  process.exit(1)
})

const app = express()

app.use(cors())
app.use(middleware.auth)
app.use('/api/graphql', graphqlHTTP({
  schema,
  graphiql: false,
}))
app.listen(listenPort, () => {
  log.info(`Listening on port ${listenPort}`)
})

process.on('uncaughtException', err => {
  log.error(err)
  process.exit(1)
})
