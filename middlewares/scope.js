const { Client } = require('../models')

const getScopes = () => (req, res, next) => {
  const apiKeyValue = req.query.apiKey

  if (!apiKeyValue) {
    return res.status(401).send({ message: 'You must provide an API key in the URL query string.  See https://charitybase.uk/api-portal for more information.' })
  }

  Client.findOne({ 'apiKeys.value': apiKeyValue }, (err, client) => {
    if (err) {
      return res.status(400).send({ message: err.message })
    }
    if (!client) {
      return res.status(401).send({ message: `The provided API key is not valid: '${apiKeyValue}'` })
    }
    const apiKeyObj = client.apiKeys.find(x => x.value === apiKeyValue)
    req.apiKeyValue = apiKeyValue
    req.apiScopes = apiKeyObj.scopes
    return next()
  })
}

const checkScopes = requiredScope => (req, res, next) => {
  const isInScope = req.apiScopes && req.apiScopes.indexOf(requiredScope) > -1
  if (!isInScope) {
    return res.status(401).send({ message: `You don't have the required API scope '${requiredScope}'` })
  }
  next()
}

module.exports = {
  getScopes,
  checkScopes,
}