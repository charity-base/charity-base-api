const { dynamoClient } = require('../../../connection')

const deleteApiKey = async function({ id }, req) {
  try {
    const params = {
      Key: { id },
      ConditionExpression: 'attribute_exists(id) AND userId = :userId',
      ExpressionAttributeValues: {
        ":userId": req.user.sub,
      },
      ReturnValues: 'ALL_OLD',
    }
    const data = await dynamoClient.delete(params).promise()
    return data.Attributes
  } catch(e) {
    throw `Failed to delete api key; ${e.message}`
  }
}

module.exports = deleteApiKey
