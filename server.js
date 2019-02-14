require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
// const apiRouter = require('./routers')
const log = require('./helpers/logger')
const { mongooseConnection } = require('./connection')
const controllers = require('./controllers')
const schema = require('./graphql-schema')
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
    return res.status(401).json({ message: 'No authorization header received' })
  }
  const authHeaders = req.headers.authorization.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})
  req.apiKeyValue = authHeaders.apikey
  // req.authToken = authHeaders.bearer
  // TODO: check valid jwt & attach to req (or reject request)
  next()
})

// validate apikey and attach scopes to req:
// todo: separate this into a separate auth api
app.use(async function(req, res, next) {
  const { apiKeyValue } = req

  if (!apiKeyValue) {
    return res.status(401).send({ message: 'You must provide an API key in the authorization header.  See https://charitybase.uk/api-portal for more information.' })
  }

  try {
    const client = await Client.findOne({ 'apiKeys.value': apiKeyValue })
    log.info('client')
    log.info(client)
    if (!client) throw new Error(`The provided API key is not valid: '${apiKeyValue}'`)
    const apiKeyObj = client.apiKeys.find(x => x.value === apiKeyValue)
    req.apiScopes = apiKeyObj.scopes
  } catch(err) {
    log.error(err)
    return res.status(400).send({ message: err.message })
  }

  next()
})

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
