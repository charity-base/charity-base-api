const charityRouter = require('express').Router()
const Charity = require('../models/charity')
const log = require('../helpers/logger')

const getCharityRouter = version => {

  charityRouter.get('/', (req, res, next) => {

    const { query, meta } = res.locals.elasticSearch

    return Charity
    .search(query, meta, function(err, results) {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({ version, query: { query, meta }, charities: results.hits.hits.map(x => x._source) })
    })
  })

  return charityRouter
}

module.exports = getCharityRouter
