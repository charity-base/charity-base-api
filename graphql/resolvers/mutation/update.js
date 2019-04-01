const { dynamoClient } = require('../../../connection')

const REQUIRED_SCOPE = 'edit:apikeys'

const updateApiKey = async function({ id, scopes }, req) {
  try {
    const { user } = req
    const isAllowed = user && user.permissions && user.permissions.indexOf(REQUIRED_SCOPE) > -1
    if (!isAllowed) {
      throw `User missing required scope: ${REQUIRED_SCOPE}`
    }
    const params = {
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set scopes = :scopes',
      ExpressionAttributeValues: {
        ':scopes' : scopes,
      },
      ReturnValues: 'ALL_NEW',
    }
    const data = await dynamoClient.update(params).promise()
    return data.Attributes
  } catch(e) {
    throw e
  }
}

module.exports = updateApiKey
