const { dynamoClient } = require('../../../connection')

const updateApiKey = async function({ id, roles }) {
  try {
    const params = {
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set #r = :roles',
      ExpressionAttributeNames: {
        '#r': 'roles',
      },
      ExpressionAttributeValues: {
        ':roles' : roles,
      },
      ReturnValues: 'ALL_NEW',
    }
    const data = await dynamoClient.update(params).promise()
    return data.Attributes
  } catch(e) {
    throw `Failed to update api key; ${e.message}`
  }
}

module.exports = updateApiKey
