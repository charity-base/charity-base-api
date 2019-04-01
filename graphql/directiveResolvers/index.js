const apiKeyAuth = require('./apiKeyAuth')
const hasScopes = require('./hasScopes')
const jwtAuth = require('./jwtAuth')
const jwtScopes = require('./jwtScopes')

const directiveResolvers = {
  apiKeyAuth,
  hasScopes,
  jwtAuth,
  jwtScopes,
}

module.exports = directiveResolvers
