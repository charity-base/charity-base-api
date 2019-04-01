const { dynamoClient } = require('../../../connection')

const deleteApiKey = async function({ id }) {
  try {
    const params = {
      Key: { id },
      ConditionExpression: 'attribute_exists(id) AND userId = :userId',
      ExpressionAttributeValues: {
        ":userId": "auth0|a", // todo: get userId from jwt auth header
      },
      ReturnValues: 'ALL_OLD',
    }
    const data = await dynamoClient.delete(params).promise()
    return data.Attributes
  } catch(e) {
    throw e
  }
}

module.exports = deleteApiKey
