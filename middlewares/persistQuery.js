const log = require('../helpers/logger')
const mongoose = require('mongoose')

const hitSchema = new mongoose.Schema({
  url: String,
  version: String,
  user: { },
  query: { },
}, {
  timestamps : true
})

const Hit = mongoose.model('Hit', hitSchema)

const stripQuery = query => {
  // Strips . and $ characters from a mongo query (with the exception of decimal points) to allow persisting the query to a mongo doc.
  return JSON.parse(
    JSON.stringify(query).replace(/\D\./g, x => x.replace('.', '|')).replace(/\$/g, '£')
  )
}

const persistRequest = (url, version, user, query, ) => {
  const hit = new Hit({
    url,
    version,
    user,
    query: stripQuery(query),
  })

  hit.save().then(x => {
  }).catch(err => {
    log.error(err)
  })
}

const persistQuery = () => (req, res, next) => {
  const { elasticSearch } = res.locals
  persistRequest(req.url, req.params.version, req.user, elasticSearch)
  return next()
}

module.exports = persistQuery
