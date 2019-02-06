const jwt = require('express-jwt')
const apiRouter = require('express').Router({mergeParams: true})
const charityRouter = require('./charity')
const apiKeyRouter = require('./api-key')
const { getScopes, checkScopes, verifyValidVersion, parseQuery, persistQuery } = require('../middlewares')
const { esClient } = require('../connection')

const getApiRouter = (acceptedVersion, elasticConfig, jwtConfig) => {

  const esIndex = elasticConfig.index

  const jwtOptionalCheck = jwt({ ...jwtConfig, credentialsRequired: false })
  const jwtEnforcedCheck = jwt({ ...jwtConfig, credentialsRequired: true })

  apiRouter.use(getScopes())
  apiRouter.use(jwtOptionalCheck)
  apiRouter.use(verifyValidVersion(acceptedVersion))
  apiRouter.use(parseQuery())
  apiRouter.use(persistQuery())

  apiRouter.use(
    '/api-key',
    checkScopes('admin'),
    jwtEnforcedCheck,
    apiKeyRouter(),
  )
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
  apiRouter.use(
    '/download-charities',
    checkScopes('download'),
    jwtEnforcedCheck,
    charityRouter.download(esClient, esIndex),
  )
  apiRouter.use(
    '/aggregate-charities',
    checkScopes('aggregate'),
    charityRouter.aggregate(esClient, esIndex),
  )

  return apiRouter
}

module.exports = getApiRouter
