const { makeExecutableSchema } = require('graphql-tools')
const directiveResolvers = require('./directiveResolvers')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

const schema = makeExecutableSchema({
  directiveResolvers,
  resolvers,
  typeDefs,
})

module.exports = schema
