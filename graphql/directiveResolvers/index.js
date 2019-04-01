const apiKeyAuth = require('./apiKeyAuth')
const apiKeyRoles = require('./apiKeyRoles')
const jwtAuth = require('./jwtAuth')
const jwtScopes = require('./jwtScopes')

const directiveResolvers = {
  apiKeyAuth,
  apiKeyRoles,
  jwtAuth,
  jwtScopes,
}

module.exports = directiveResolvers
