const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseQuery = require('../middlewares/parseQuery')
const persistQuery = require('../middlewares/persistQuery')

const getApiRouter = acceptedVersion => {

  apiRouter.use(verifyValidVersion(acceptedVersion))

  apiRouter.use(parseQuery())
  apiRouter.use(persistQuery(acceptedVersion))

  apiRouter.use('/charities', getCharitiesRouter(acceptedVersion))
  
  apiRouter.use('/download-charities', getDownloadCharitiesRouter())

  return apiRouter
}

module.exports = getApiRouter
