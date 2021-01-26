const mutationResolvers = require('./mutation')
const queryResolvers = require('./query')

module.exports = {
  Mutation: mutationResolvers,
  Query: queryResolvers,
}
