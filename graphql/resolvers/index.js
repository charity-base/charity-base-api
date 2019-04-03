const customTypes = require('./custom-types')
const queryResolvers = require('./query')

module.exports = {
  ...customTypes,
  Query: queryResolvers,
}
