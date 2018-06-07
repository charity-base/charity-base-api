const charityRouter = require('express').Router()
const Charity = require('../models/charity')
const log = require('../helpers/logger')

getCharityRouter = version => {

  charityRouter.get('/', (req, res, next) => {

    const { query } = res.locals

    return Charity
    .find(query.filter)
    .select(query.projection)
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .exec()
    .then(charities => res.json({
      version,
      query,
      charities,
    }))
    .catch(err => {
      log.error(err)
      return res.status(400).send(err)
    })
  })

  return charityRouter
}

module.exports = getCharityRouter
