const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseQuery = require('../middlewares/parseQuery')
const persistQuery = require('../middlewares/persistQuery')

const getApiRouter = version => {

  apiRouter.use(verifyValidVersion(version))

  apiRouter.use(parseQuery)
  apiRouter.use(persistQuery)

  apiRouter.use('/charities', getCharitiesRouter(version))
  
  apiRouter.use('/download-charities', getDownloadCharitiesRouter())

  return apiRouter
}

module.exports = getApiRouter
