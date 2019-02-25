const typeDefs = `
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  directive @hasScopes(scopes: [String]) on QUERY | FIELD_DEFINITION

  scalar PageLimit

  enum DistanceUnit {
    mi
    yd
    km
    m
  }

  input IntegerRangeInput {
    equals: Int
    lessThanInclusive: Int
    lessThanExclusive: Int
    moreThanInclusive: Int
    moreThanExclusive: Int
  }

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
    """
    Apply conditions to the length of the array field.
    """
    length: IntegerRangeInput
  }

  input GrantsFilterInput {
    funders: ListFilterInput
  }

  input GeoBoundingBoxInput {
    top: Float!
    left: Float!
    bottom: Float!
    right: Float!
  }

  input GeoBoundingCircleInput {
    radius: Int!
    unit: DistanceUnit
    latitude: Float!
    longitude: Float!
  }

  input GeoFilterInput {
    boundingBox: GeoBoundingBoxInput
    boundingCircle: GeoBoundingCircleInput
  }

  input FilterCHCInput {
    id: [ID]
    search: String
    areas: ListFilterInput
    causes: ListFilterInput
    beneficiaries: ListFilterInput
    operations: ListFilterInput
    grants: GrantsFilterInput
    geo: GeoFilterInput
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

  type Grant {
    id: ID
    title: String
    description: String
    fundingOrganization: [IdName]
    amountAwarded: Float
    currency: String
    awardDate: String
  }

  type GeoCodes {
    admin_district: String
    admin_county: String
    admin_ward: String
    parish: String
    parliamentary_constituency: String
    ccg: String
    ced: String
    nuts: String
  }

  type Geo {
    postcode: String
    quality: String
    eastings: Int
    northings: Int
    country: String
    nhs_ha: String
    longitude: Float
    latitude: Float
    european_electoral_region: String
    primary_care_trust: String
    region: String
    lsoa: String
    msoa: String
    incode: String
    outcode: String
    parliamentary_constituency: String
    admin_district: String
    parish: String
    admin_county: String
    admin_ward: String
    ced: String
    ccg: String
    nuts: String
    codes: GeoCodes
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
    grants: [Grant]
    geo: Geo
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
    causes: Aggregation
    beneficiaries: Aggregation
    operations: Aggregation
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
