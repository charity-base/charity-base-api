const elasticsearch = require('elasticsearch')
const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getCountCharitiesRouter = require('./count-charities')
const getDownloadCharitiesRouter = require('./download')
const getAggregateCharitiesRouter = require('./aggregate-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseElasticSearchQuery = require('../middlewares/parse-query')
const persistQuery = require('../middlewares/persistQuery')

const getElasticClient = host => {
  const esClient = new elasticsearch.Client({ host })
  return esClient
}

const getApiRouter = (acceptedVersion, elasticConfig) => {

  const esClient = getElasticClient(elasticConfig.host)
  const esIndex = elasticConfig.index

  apiRouter.use(verifyValidVersion(acceptedVersion))

  apiRouter.use(parseElasticSearchQuery())
  apiRouter.use(persistQuery())

  apiRouter.use('/charities', getCharitiesRouter(esClient, esIndex))
  apiRouter.use('/count-charities', getCountCharitiesRouter(esClient, esIndex))
  apiRouter.use('/download-charities', getDownloadCharitiesRouter(esClient, esIndex))
  apiRouter.use('/aggregate-charities', getAggregateCharitiesRouter(esClient, esIndex))

  return apiRouter
}

module.exports = getApiRouter
