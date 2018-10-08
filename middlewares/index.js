const { getScopes, checkScopes } = require('./scope')
const verifyValidVersion = require('./version')
const persistQuery = require('./persist')
const parseQuery = require('./parse-query')

module.exports = {
  getScopes,
  checkScopes,
  verifyValidVersion,
  persistQuery,
  parseQuery,
}