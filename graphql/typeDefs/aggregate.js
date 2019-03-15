const typeDefs = `
  type AggregationBucket {
    id: String @deprecated(reason: "Use \`key\` instead.")
    """Unique across a given aggregation's buckets"""
    key: String
    """Aggregation bucket description"""
    name: String
    """Number of charities in the aggregation bucket"""
    count: Int
    """If the aggregation is on a numerical field e.g. income, the \`sum\` gives the bucket's cumulative total of that field."""
    sum: Float
    sumIncome: Float @deprecated(reason: "Use \`sum\` instead.")
  }

  type Aggregation {
    buckets: [AggregationBucket]
  }

  type GeoAggregation {
    geohash: Aggregation
    region: Aggregation
    country: Aggregation
  }

  type FinancesAggregation {
    latestIncome: Aggregation
  }

  type AggregationTypesCHC {
    income: Aggregation @deprecated(reason: "Use \`finances\` instead.")
    finances: FinancesAggregation
    causes: Aggregation
    beneficiaries: Aggregation
    operations: Aggregation
    areas: Aggregation
    """
    Aggregate charities by the geolocation of their registered office.
    Specify \`top\`, \`bottom\`, \`left\` & \`right\` arguments to further restrict the search range without affecting the other \`getCharities\` results.
    This is useful if you're presenting geo aggregations in a map view.
    """
    geo(
      """Latitude defining the portal's top boundary. Default: \`90\`."""
      top: Float = 90
      """Longitude defining the portal's left boundary. Default: \`-180\`."""
      left: Float = -180
      """Latitude defining the portal's bottom boundary. Default: \`-90\`."""
      bottom: Float = -90
      """Longitude defining the portal's right boundary. Default: \`180\`."""
      right: Float = 180
    ): GeoAggregation
  }
`

module.exports = typeDefs
