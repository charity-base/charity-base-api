const apiKeyAuth = require('./apiKeyAuth')
const jwtAuth = require('./jwtAuth')
const jwtScopes = require('./jwtScopes')

const directiveResolvers = {
  apiKeyAuth,
  jwtAuth,
  jwtScopes,
}

module.exports = directiveResolvers
