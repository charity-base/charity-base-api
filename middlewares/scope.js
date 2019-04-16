const { dynamoClient } = require('../connection')

const getScopes = () => async function(req, res, next) {
  const apiKeyValue = req.query.apiKey

  if (!apiKeyValue) {
    return res.status(401).send({ message: 'You must provide an API key in the URL query string.  See https://charitybase.uk/api-portal for more information.' })
  }


  try {
    // It would be cleaner to hit the /auth/graphql api here to validate apikey but for performance we query dynamodb directly instead.
    const params = {
      Key: {
        id: apiKeyValue
      }
    }
    const data = await dynamoClient.get(params).promise()
    if (!data.Item) {
      throw new Error()
    }
    req.apiKeyValue = data.Item.id
    req.apiScopes = data.Item.roles
    return next()
  } catch(e) {
    return res.status(400).send({ message: `The provided API key is not valid: "${apiKeyValue}"` })
  }
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
