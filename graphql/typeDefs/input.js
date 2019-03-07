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
    lessThanInclusive: Int @deprecated(reason: "Use \`lte\`.")
    lessThanExclusive: Int @deprecated(reason: "Use \`lt\`.")
    moreThanInclusive: Int @deprecated(reason: "Use \`gte\`.")
    moreThanExclusive: Int @deprecated(reason: "Use \`gt\`.")
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
  }

  input LatestIncomeInput {
    total: NumericRangeInput
  }

  input IncomeFilterInput {
    latest: LatestIncomeInput
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
    income: IncomeFilterInput
    registrationDate: DateRangeInput
  }
`

module.exports = typeDefs
