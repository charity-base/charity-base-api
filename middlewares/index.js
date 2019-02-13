const { getScopes, checkScopes } = require('./scope')
const persistQuery = require('./persist')
const parseQuery = require('./parse-query')

module.exports = {
  getScopes,
  checkScopes,
  persistQuery,
  parseQuery,
}