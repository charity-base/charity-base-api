const { makeExecutableSchema } = require('graphql-tools')
const directiveResolvers = require('./directives')
const { GraphQLInputInt } = require('graphql-input-number')


const typeDefs = `
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  directive @hasScopes(scopes: [String]) on QUERY | FIELD_DEFINITION

  scalar PageLimit

  input FilterCHC {
    search: String
  }

  """
  Charity registered in England & Wales
  """
  type CharityCHC {
    id: String
    """
    Registered name of the charity
    """
    name: String
    """
    Short description of the charity's activities
    """
    activities: String
  }
  
  """
  Various formats to represent filtered charities
  """
  type FilteredCharitiesCHC {
    """
    Number of charities matching query
    """
    count: Int
    """
    List of charities matching query
    """
    list(limit: PageLimit, skip: Int, sort: String): [CharityCHC]
  }

  type QueryCHC {
    """
    Query charities registered in England & Wales
    """
    getCharities(filters: FilterCHC!): FilteredCharitiesCHC @hasScopes(scopes: ["basic"])
  }

  type Query {
    """
    Charity Commission of England & Wales
    """
    CHC: QueryCHC @isAuthenticated
  }
`

const PageLimit = GraphQLInputInt({
  name: 'PageLimit',
  description: 'The `PageLimit` integer type defines the number of results returned per request.  `Min`: 1, `Max`: 30.  If you want much more than this you should consider an aggregation or download query instead of list.',
  min: 1,
  max: 30,
})

const resolvers = {
  PageLimit,
}

const schema = makeExecutableSchema({ typeDefs, directiveResolvers, resolvers })

module.exports = schema
