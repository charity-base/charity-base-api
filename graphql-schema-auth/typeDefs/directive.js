const typeDefs = `
  directive @jwtAuth(scopes: [String!] = []) on QUERY | FIELD_DEFINITION
`

module.exports = typeDefs
