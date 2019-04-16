const jwt = require('express-jwt')
const apiRouter = require('express').Router({mergeParams: true})
const charityRouter = require('./charity')
const apiKeyRouter = require('./api-key')
const { getScopes, checkScopes, parseQuery, persistQuery } = require('../middlewares')
const { esClient } = require('../connection')
const config = require('../config.json')

const esIndex = config.elastic.index

const jwtConfig = {
  audience: config.jwt.audience,
  issuer: config.jwt.issuer,
  secret: process.env.CHARITY_BASE_AUTH0_JWT_SECRET,
}

const jwtOptionalCheck = jwt({ ...jwtConfig, credentialsRequired: false })
const jwtEnforcedCheck = jwt({ ...jwtConfig, credentialsRequired: true })

const getApiRouter = () => {

  apiRouter.use(getScopes())
  apiRouter.use(jwtOptionalCheck)
  apiRouter.use(parseQuery())
  apiRouter.use(persistQuery())

  // apiRouter.use(
  //   '/api-key',
  //   jwtEnforcedCheck,
  //   apiKeyRouter(),
  // )
  apiRouter.use(
    '/charities',
    checkScopes('basic'),
    charityRouter.list(esClient, esIndex),
  )
  apiRouter.use(
    '/count-charities',
    checkScopes('basic'),
    charityRouter.count(esClient, esIndex),
  )
  // apiRouter.use(
  //   '/download-charities',
  //   checkScopes('download'),
  //   jwtEnforcedCheck,
  //   charityRouter.download(esClient, esIndex),
  // )
  apiRouter.use(
    '/aggregate-charities',
    checkScopes('basic'),
    charityRouter.aggregate(esClient, esIndex),
  )

  return apiRouter
}

module.exports = getApiRouter
