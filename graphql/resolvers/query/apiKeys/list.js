const { dynamoClient } = require('../../../../connection')

const listKeys = async function(_, req) {
  try {
    const params = {
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.sub,
      },
      Select: 'ALL_ATTRIBUTES',
    }
    const data = await dynamoClient.query(params).promise()
    return data.Items || []
  } catch(e) {
    throw `Failed to list api keys; ${e.message}`
  }
}

module.exports = listKeys
