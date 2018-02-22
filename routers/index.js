const apiRouter = require('express').Router({mergeParams: true});
const getCharitiesRouter = require('./charities');
const verifyValidVersion = require('../middlewares/verifyValidVersion');
const persistRequest = require('../middlewares/persistRequest');

const getApiRouter = version => {
  apiRouter.use(persistRequest());

  apiRouter.use(verifyValidVersion(version));

  apiRouter.use('/charities', getCharitiesRouter());
  
  return apiRouter;
}


module.exports = getApiRouter;
