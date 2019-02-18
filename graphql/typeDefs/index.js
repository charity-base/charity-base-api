const typeDefs = `
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  directive @hasScopes(scopes: [String]) on QUERY | FIELD_DEFINITION

  scalar PageLimit

  input ListFilterInput {
    # every: [String]
    """
    Matches one or more of the provided values.
    """
    some: [String]
    # notEvery: [String]
    # notSome: [String]
  }

  input FilterCHCInput {
    id: [String]
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
    total: Int
  }

  type IncomeCHC {
    latest: IncomeLatestCHC
  }

  type IdName {
    id: String
    name: String
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
    income: IncomeCHC
    areas: [IdName]
    causes: [IdName]
    beneficiaries: [IdName]
    operations: [IdName]
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
