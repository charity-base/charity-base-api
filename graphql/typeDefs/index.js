const typeDefs = `
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  directive @hasScopes(scopes: [String]) on QUERY | FIELD_DEFINITION

  scalar PageLimit

  """
  This input type allows filtering on a field which itself contains a list of values.
  """
  input ListFilterInput {
    """
    Require that the field contains all of the provided values (logical AND).
    """
    every: [String]
    """
    Require that the field contains one or more of the provided values (logical OR).
    """
    some: [String]
    """
    Require that the field contains none of the provided values (logical AND NOT).
    """
    notSome: [String]
  }

  input FilterCHCInput {
    id: [ID]
    search: String
    areas: ListFilterInput
    funders: ListFilterInput
    causes: ListFilterInput
    beneficiaries: ListFilterInput
    operations: ListFilterInput
  }

  type IncomeLatestCHC {
    "End date of latest financial year"
    date: String
    "Latest gross income GBP"
    total: Float
  }

  type IncomeCHC {
    latest: IncomeLatestCHC
  }

  type IdName {
    id: ID
    name: String
  }

  """
  Charity registered in England & Wales
  """
  type CharityCHC {
    id: ID
    """
    Registered name of the charity
    """
    name: String
    """
    Short description of the charity's activities
    """
    activities: String
    income: IncomeCHC
    areas: [IdName]
    causes: [IdName]
    beneficiaries: [IdName]
    operations: [IdName]
  }

  type AggregationBucket {
    id: ID
    name: String
    count: Int
    sumIncome: Float
  }

  type Aggregation {
    buckets: [AggregationBucket]
  }

  type AggregationTypesCHC {
    income: Aggregation
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

module.exports = typeDefs
