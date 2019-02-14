require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
// const apiRouter = require('./routers')
const log = require('./helpers/logger')
const { mongooseConnection } = require('./connection')
const controllers = require('./controllers')
const schema = require('./graphql-schema')

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

mongooseConnection.catch(err => {
  log.error(err)
  process.exit(1)
})

const app = express()
// TODO: add middleware to persist query (extract apiKey into it's own field)
app.use((req, res, next) => {
  log.info(`Requested with api token: ${req.query.apiKey}`)
  // TODO: check valid (by calling mongodb) & attach scopes to req (or reject request)
  next()
})
app.use((req, res, next) => {
  log.info(`Requested with auth token: ${req.headers.authorization}`)
  // TODO: check valid jwt & attach to req (or reject request)
  next()
})
app.use(cors())
app.use('/api/graphql', graphqlHTTP({
  schema,
  rootValue: controllers,
  graphiql: true,
}))
app.listen(listenPort, () => {
  log.info(`Listening on port ${listenPort}`)
})

process.on('uncaughtException', err => {
  log.error(err)
  process.exit(1)
})
