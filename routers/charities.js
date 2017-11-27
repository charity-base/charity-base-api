const charityRouter = require('express').Router();
const getCharities = require('../controllers/charity-controller'),

getCharityRouter = () => {

  charityRouter.get('/', getCharities);

  return charityRouter;
}

module.exports = getCharityRouter;
