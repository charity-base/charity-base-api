const { dynamoClient } = require('../../../connection')

const updateApiKey = async function({ id, scopes }) {
  try {
    // todo: get user from jwt auth header & check has admin privelege (and put this in a directive)
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
