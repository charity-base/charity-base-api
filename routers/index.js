const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')
const parseQuery = require('../middlewares/parseQuery')

const getApiRouter = version => {

  apiRouter.use(verifyValidVersion(version))

  apiRouter.use(parseQuery)

  apiRouter.use('/charities', getCharitiesRouter())
  
  apiRouter.use('/download-charities', getDownloadCharitiesRouter())

  return apiRouter
}

module.exports = getApiRouter
