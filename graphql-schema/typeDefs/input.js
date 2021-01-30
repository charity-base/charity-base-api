const typeDefs = `
  input NumericRangeInput {
    """
    Greater than or equal to.
    """
    gte: Float
    """
    Greater than.
    """
    gt: Float
    """
    Less than or equal to.
    """
    lte: Float
    """
    Less than.
    """
    lt: Float
  }

  input DateRangeInput {
    """
    Greater than or equal to. \`yyyy-MM-dd\`.
    """
    gte: String
    """
    Greater than. \`yyyy-MM-dd\`.
    """
    gt: String
    """
    Less than or equal to. \`yyyy-MM-dd\`.
    """
    lte: String
    """
    Less than. \`yyyy-MM-dd\`.
    """
    lt: String
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
    length: NumericRangeInput
  }

  input GrantsFilterInput {
    funders: ListFilterInput
  }

  input GeoBoundingBoxInput {
    """
    Latitude defining the box's top boundary.
    """
    top: Float!
    """
    Longitude defining the box's left boundary.
    """
    left: Float!
    """
    Latitude defining the box's bottom boundary.
    """
    bottom: Float!
    """
    Longitude defining the box's right boundary.
    """
    right: Float!
  }

  input GeoBoundingCircleInput {
    """Radius of circle."""
    radius: Int!
    """Unit of circle radius."""
    unit: DistanceUnit = mi
    """Latitude of circle centre."""
    latitude: Float!
    """Longitude of circle centre."""
    longitude: Float!
  }

  input GeoFilterInput {
    boundingBox: GeoBoundingBoxInput
    boundingCircle: GeoBoundingCircleInput
    geohashes: [String]
    region: GeoRegion
    country: GeoCountry
    laua: String
  }

  input FinancesFilterInput {
    latestIncome: NumericRangeInput
    latestSpending: NumericRangeInput
  }

  input RegistrationsFilterInput {
    latestRegistrationDate: DateRangeInput
  }

  input ImageFilterInput {
    smallLogoExists: Boolean
    mediumLogoExists: Boolean
  }

  input SocialFilterInput {
    twitterExists: Boolean
    facebookExists: Boolean
    instagramExists: Boolean
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
    finances: FinancesFilterInput
    registrations: RegistrationsFilterInput
    trustees: ListFilterInput
    topics: ListFilterInput
    image: ImageFilterInput
    social: SocialFilterInput
  }
`

module.exports = typeDefs
