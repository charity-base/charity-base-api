const log = require('../helpers/logger')
const { Client } = require('../models')

// Extract API key from header & attach to req (along with validity & scopes)
// These credentials are then used for authorization in graphql directive resolvers
async function authMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    return next()
  }
  const authHeaders = req.headers.authorization.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})

  const apiKeyValue = authHeaders.apikey

  if (!apiKeyValue) {
    return next()
  }

  req.apiKeyValue = apiKeyValue
  
  try {
    const client = await Client.findOne({ 'apiKeys.value': apiKeyValue })
    if (!client) return next()
    const apiKeyObj = client.apiKeys.find(x => x.value === apiKeyValue)
    req.apiKeyValid = true
    req.apiScopes = apiKeyObj.scopes
  } catch(err) {
    log.error(err)
  }
  next()
}

module.exports = authMiddleware
