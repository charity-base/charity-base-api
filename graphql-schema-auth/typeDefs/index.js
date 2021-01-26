const directiveTypes = require('./directive')

const typeDefs = `
  scalar Date

  type ApiKey {
    id: ID
    roles: [String!]
    createdAt: Date
    updatedAt: Date
  }

  type QueryApiKeys {
    listKeys: [ApiKey]
  }

  type Query {
    apiKeys: QueryApiKeys @jwtAuth
  }

  type MutationApiKeys {
    createKey: ApiKey
    updateKey(
      id: ID!
      roles: [String!]!
    ): ApiKey @jwtAuth(scopes: ["edit:apikeys"])
    deleteKey(
      id: ID!
    ): ApiKey
  }

  type Mutation {
    apiKeys: MutationApiKeys @jwtAuth
  }
`

module.exports = [
  directiveTypes,
  typeDefs,
]
