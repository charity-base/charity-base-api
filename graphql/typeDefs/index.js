const directiveTypes = require('./directive')
const enumTypes = require('./enum')
const customTypes = require('./custom')
const inputTypes = require('./input')
const listCharitiesTypes = require('./list')
const aggregateCharitiesTypes = require('./aggregate')

const highLevelTypes = `
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
    list(
      limit: PageLimit = 10
      skip: Int = 0
      sort: String
    ): [CharityCHC]
    """
    Aggregations of charities matching query
    """
    aggregate: AggregationTypesCHC
  }

  type FilterCHC {
    id: ID
    value: String
    label: String
    filterType: String # todo: change to enum
    score: Float
  }

  type QueryCHC {
    """
    Query charities registered in England & Wales
    """
    getCharities(filters: FilterCHCInput!): FilteredCharitiesCHC @hasScopes(scopes: ["basic"])
    getFilters(prefix: String, id: [ID]): [FilterCHC]
  }

  type Query {
    """
    Charity Commission of England & Wales
    """
    CHC: QueryCHC @isAuthenticated
  }
`

module.exports = [
  directiveTypes,
  enumTypes,
  customTypes,
  inputTypes,
  listCharitiesTypes,
  aggregateCharitiesTypes,
  highLevelTypes,
]
