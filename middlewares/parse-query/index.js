const parseSearch = require('./search')
const parseFilter = require('./filter')
const parseMeta = require('./meta')

const intercept = query => {
  const searchNumber = Number(query['search'])
  if (searchNumber && searchNumber > 200000) {
    query['ids.GB-CHC'] = query['search']
    query['search'] = undefined
  }
}

const getQuery = () => (req, res, next) => {

  const { query } = req

  // Temporary hack to allow searching charity numbers
  // TODO: add string field for raw charity numbers instead
  intercept(query)

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
