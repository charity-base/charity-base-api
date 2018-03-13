const mongoose = require('mongoose')
const Charity = require('../models/charity')
const log = require('../helpers/logger')

const LATEST_VERSION = 'v0.3.0'

const hitSchema = new mongoose.Schema({
  url: String,
  countResults: Boolean,
  version: String,
  query: {
    filter: mongoose.Schema.Types.Mixed,
    projection: mongoose.Schema.Types.Mixed,
    sort: mongoose.Schema.Types.Mixed,
    limit: Number,
    skip: Number,
  },
}, {
  timestamps : true
})

const Hit = mongoose.model('Hit', hitSchema)

const stripQuery = query => {
  // Strips . and $ characters from a mongo query to allow persisting the query to a mongo doc.
  return JSON.parse(
    JSON.stringify(query).replace(/\./g, '|').replace(/\$/g, '£')
  )
}

const persistRequest = (url, query, countResults, version) => {
  const hit = new Hit({
    url: url,
    countResults,
    version,
    query: stripQuery(query),
  })

  hit.save().then(x => {
  }).catch(err => {
    log.error(err)
  })
}


const getCharities = (req, res, next) => {

  const { query } = res.locals
  const countResults = req.query.hasOwnProperty('countResults')

  persistRequest(req.url, query, countResults, LATEST_VERSION)

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
      version : LATEST_VERSION,
      totalMatches : count,
      query,
      charities,
    })
  })
  .catch(err => {
    log.error(err)
    return res.status(400).send(err)
  })
}

module.exports = getCharities
