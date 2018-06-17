const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getCountCharitiesRouter = require('./count-charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseElasticSearchQuery = require('../middlewares/parse-query')
const persistQuery = require('../middlewares/persistQuery')

const getApiRouter = acceptedVersion => {

  apiRouter.use(verifyValidVersion(acceptedVersion))

  apiRouter.use(parseElasticSearchQuery())
  // apiRouter.use(persistQuery(acceptedVersion))

  apiRouter.use('/charities', getCharitiesRouter(acceptedVersion))
  apiRouter.use('/count-charities', getCountCharitiesRouter(acceptedVersion))
  apiRouter.use('/download-charities', getDownloadCharitiesRouter())

  return apiRouter
}

module.exports = getApiRouter
