require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const log = require('./helpers/logger')
const { mongooseConnection } = require('./connection')
const schema = require('./graphql')
const { Client } = require('./models')

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const listenPort = process.env.PORT || 4000

mongooseConnection.catch(err => {
  log.error(err)
  process.exit(1)
})

const app = express()

app.use(cors())

// extract apikey from authorization header:
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return next()
  }
  const authHeaders = req.headers.authorization.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})
  req.apiKeyValue = authHeaders.apikey
  next()
})

// validate apikey and attach scopes to req:
// todo: separate this into a separate auth api
app.use(async function(req, res, next) {
  const { apiKeyValue } = req
  if (!apiKeyValue) {
    return next()
  }
  try {
    const client = await Client.findOne({ 'apiKeys.value': apiKeyValue })
    if (!client) return next()
    const apiKeyObj = client.apiKeys.find(x => x.value === apiKeyValue)
    req.apiKeyValid = true
    req.apiScopes = apiKeyObj.scopes
  } catch(err) {
    log.error(err)
  }
  next()
})

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
