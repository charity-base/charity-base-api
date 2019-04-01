const isAuthenticated = require('./isAuthenticated')
const jwtAuth = require('./jwtAuth')
const hasScopes = require('./hasScopes')

const directiveResolvers = {
  isAuthenticated,
  hasScopes,
  jwtAuth,
}

module.exports = directiveResolvers
