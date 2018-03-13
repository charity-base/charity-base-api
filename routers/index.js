const apiRouter = require('express').Router({mergeParams: true})
const getCharitiesRouter = require('./charities')
const getDownloadCharitiesRouter = require('./download-charities')
const verifyValidVersion = require('../middlewares/verifyValidVersion')

const getApiRouter = version => {

  apiRouter.use(verifyValidVersion(version))

  // TODO: generate middleware to save aqp query to res.locals

  apiRouter.use('/charities', getCharitiesRouter())
  
  apiRouter.use('/download-charities', getDownloadCharitiesRouter())

  return apiRouter
}

module.exports = getApiRouter
