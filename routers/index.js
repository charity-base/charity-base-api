const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getCountCharitiesRouter = require('./count-charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseElasticSearchQuery = require('../middlewares/parse-query')
const persistQuery = require('../middlewares/persistQuery')

const getApiRouter = (acceptedVersion, elasticConfig) => {

  apiRouter.use(verifyValidVersion(acceptedVersion))

  apiRouter.use(parseElasticSearchQuery())
  apiRouter.use(persistQuery())

  apiRouter.use('/charities', getCharitiesRouter(elasticConfig))
  apiRouter.use('/count-charities', getCountCharitiesRouter(elasticConfig))
  apiRouter.use('/download-charities', getDownloadCharitiesRouter(elasticConfig))

  return apiRouter
}

module.exports = getApiRouter
