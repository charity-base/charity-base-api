const uuidv4 = require('uuid/v4')
const { dynamoClient } = require('../../../connection')


const MAX_API_KEYS = 3
const DEFAULT_ROLES = [
  'basic'
]

const createApiKey = async function(_, req) {
  try {
    const params = {
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.sub,
      },
      Select: 'COUNT',
    }
    const data = await dynamoClient.query(params).promise()
    if (data.ScannedCount >= MAX_API_KEYS) {
      throw new Error(`User already has ${data.ScannedCount} keys`)
    }
  } catch(e) {
    throw `Failed to create api key; ${e.message}`
  }

  try {
    const item = {
      id: uuidv4(),
      userId: req.user.sub,
      roles: DEFAULT_ROLES,
    }
    const params = {
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    }
    await dynamoClient.put(params).promise()
    return item
  } catch(e) {
    throw `Failed to create api key; ${e.message}`
  }
}

module.exports = createApiKey
