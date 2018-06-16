const parseSearch = require('./search')
const parseFilter = require('./filter')
const parseMeta = require('./meta')

const getQuery = () => (req, res, next) => {

  const { query } = req

  const must = parseSearch(query)
  const filter = parseFilter(query)
  const meta = parseMeta(query)

  res.locals.elasticSearch = {
    query: { bool: { must, filter } },
    meta,
  }

  return next()
}

module.exports = getQuery
