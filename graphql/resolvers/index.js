const customTypes = require('./custom-types')
const mutationResolvers = require('./mutation')
const queryResolvers = require('./query')

module.exports = {
  ...customTypes,
  Mutation: mutationResolvers,
  Query: queryResolvers,
}
