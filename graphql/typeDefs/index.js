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
    list(limit: PageLimit, skip: Int, sort: String): [CharityCHC]
    """
    Aggregations of charities matching query
    """
    aggregate: AggregationTypesCHC
  }

  type QueryCHC {
    """
    Query charities registered in England & Wales
    """
    getCharities(filters: FilterCHCInput!): FilteredCharitiesCHC @hasScopes(scopes: ["basic"])
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
