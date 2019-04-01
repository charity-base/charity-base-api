const isAuthenticated = require('./isAuthenticated')
const hasScopes = require('./hasScopes')
const jwtAuth = require('./jwtAuth')
const jwtScopes = require('./jwtScopes')

const directiveResolvers = {
  isAuthenticated,
  hasScopes,
  jwtAuth,
  jwtScopes,
}

module.exports = directiveResolvers
