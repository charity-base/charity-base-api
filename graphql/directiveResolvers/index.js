const apiKeyAuth = require('./apiKeyAuth')
const jwtAuth = require('./jwtAuth')

const directiveResolvers = {
  apiKeyAuth,
  jwtAuth,
}

module.exports = directiveResolvers
