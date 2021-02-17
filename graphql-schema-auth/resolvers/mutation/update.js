const { dynamoClient } = require("connection")

const updateApiKey = async function ({ id, roles }) {
  try {
    const dateString = new Date().toISOString()
    const params = {
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
      UpdateExpression: "SET #r = :roles, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#r": "roles",
      },
      ExpressionAttributeValues: {
        ":roles": roles,
        ":updatedAt": dateString,
      },
      ReturnValues: "ALL_NEW",
    }
    const data = await dynamoClient.update(params).promise()
    return data.Attributes
  } catch (e) {
    throw `Failed to update api key; ${e.message}`
  }
}

module.exports = updateApiKey
