const { GraphQLError } = require('graphql')

const directiveResolvers = {
  isAuthenticated(next, source, args, context) {
    if (!context.apiKeyValue) {
      throw new GraphQLError(`You must supply an Authorization header of the form "Apikey 9447fa04-c15b-40e6-92b6-30307deeb5d1". See https://charitybase.uk/api-portal for more information.`)
    }
    if (!context.apiKeyValid) {
      throw new GraphQLError(`The provided API key is not valid: "${context.apiKeyValue}"`)
    }
    return next()
  },
  hasScopes(next, source, args, context) {
    const expectedScopes = args.scopes
    const scopes = context.apiScopes
    const hasAllScopes = scopes && expectedScopes.every(x => scopes.indexOf(x) !== -1)
    if (!hasAllScopes) {
      throw new GraphQLError(`You are not authorized. Expected scopes: "${expectedScopes.join(', ')}"`)
    }
    return next()
  }
}

module.exports = directiveResolvers
