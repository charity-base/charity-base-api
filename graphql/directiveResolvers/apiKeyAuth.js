const { dynamoClient } = require('../../connection')
const { authHeaders, hasAll } = require('./helpers')

async function apiKeyAuth(next, source, args, req) {
  const expectedRoles = args.roles

  if (req.apiKey) {
    const roles = req.apiKey.roles || []
    if (!hasAll(expectedRoles, roles)) {
      throw `You are not authorized. Expected roles: "${expectedRoles.join(', ')}"`
    }
    return next()
  }

  if (!req.headers || !req.headers.authorization) {
    throw 'No authorization header sent'
  }

  const { apikey } = authHeaders(req.headers.authorization)

  if (!apikey) {
    throw `You must supply an Authorization header of the form "Apikey 9447fa04-c15b-40e6-92b6-30307deeb5d1". See https://charitybase.uk/api-portal for more information.`
  }

  try {
    // It would be cleaner to hit the /auth/graphql api here to validate apikey but for performance we query dynamodb directly instead.
    const params = {
      Key: {
        id: apikey
      }
    }
    const data = await dynamoClient.get(params).promise()
    if (!data.Item) {
      throw new Error()
    }
    req.apiKey = data.Item
  } catch(e) {
    throw `The provided API key is not valid: "${apikey}"`
  }

  const roles = req.apiKey.roles || []
  if (!hasAll(expectedRoles, roles)) {
    throw `You are not authorized. Expected roles: "${expectedRoles.join(', ')}"`
  }

  return next()
}

module.exports = apiKeyAuth
