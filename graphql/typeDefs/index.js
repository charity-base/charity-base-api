const directiveTypes = require('./directive')
const enumTypes = require('./enum')
const customTypes = require('./custom')
const inputTypes = require('./input')
const listCharitiesTypes = require('./list')
const aggregateCharitiesTypes = require('./aggregate')
const downloadCharitiesTypes = require('./download')

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
      sort: SortCHC = default
    ): [CharityCHC]
    """
    Aggregations of charities matching query
    """
    aggregate: AggregationTypesCHC
    """
    Returns a CSV containing all matches.
    This method requires special permissions on your API Key.
    Email \`support@charitybase.uk\` for more info.
    """
    download: DownloadCHC @apiKeyAuth(roles: ["download"])
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
    getCharities(filters: FilterCHCInput!): FilteredCharitiesCHC
    getFilters(
      "Search term for finding filters."
      search: String
      "List of IDs of desired filters."
      id: [ID]
      "List of filter types to return."
      filterType: [String]
    ): [FilterCHC]
  }

  type Query {
    """
    Charity Commission of England & Wales
    """
    CHC: QueryCHC @apiKeyAuth(roles: ["basic"])
  }
`

module.exports = [
  directiveTypes,
  enumTypes,
  customTypes,
  inputTypes,
  listCharitiesTypes,
  aggregateCharitiesTypes,
  downloadCharitiesTypes,
  highLevelTypes,
]
