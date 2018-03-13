const charityRouter = require('express').Router()
const Charity = require('../models/charity')
const log = require('../helpers/logger')

getCharityRouter = version => {

  charityRouter.get('/', (req, res, next) => {

    const { query } = res.locals
    const countResults = req.query.hasOwnProperty('countResults')

    return Promise.resolve(countResults ? (
      Charity.count(query.filter).exec()
    ) : null)
    .then(count => {
      return Promise.all([
        count,
        Charity
        .find(query.filter)
        .select(query.projection)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .exec()
      ])
    })
    .then(([count, charities]) => {
      return res.json({
        totalMatches : count,
        version,
        query,
        charities,
      })
    })
    .catch(err => {
      log.error(err)
      return res.status(400).send(err)
    })
  })

  return charityRouter
}

module.exports = getCharityRouter
