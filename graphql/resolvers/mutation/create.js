const uuidv4 = require('uuid/v4')
const { dynamoClient } = require('../../../connection')

const DEFAULT_SCOPES = [
  'basic'
]

const createApiKey = async function() {
  // todo: count user's existing keys and verify < max
  try {
    const item = {
      id: uuidv4(),
      userId: 'my-user-id', // todo: get from jwt auth header
      scopes: DEFAULT_SCOPES,
    }
    var params = {
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    }
    await dynamoClient.put(params).promise()
    return item
  } catch(e) {
    throw e
  }
}

module.exports = createApiKey
