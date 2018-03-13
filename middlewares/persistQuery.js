const mongoose = require('mongoose')

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

const persistQuery = (req, res, next) => {
  const { query } = res.locals
  const countResults = req.query.hasOwnProperty('countResults')

  persistRequest(req.url, query, countResults, LATEST_VERSION)

  return next()
}

module.exports = persistQuery
