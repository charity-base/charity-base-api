const typeDefs = `
  type AggregationBucket {
    id: ID
    name: String
    count: Int
    sumIncome: Float
  }

  type Aggregation {
    buckets: [AggregationBucket]
  }

  type GeoAggregation {
    geohash: Aggregation
  }

  type AggregationTypesCHC {
    income: Aggregation
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
      top: Float,
      """Longitude defining the portal's left boundary. Default: \`-180\`."""
      left: Float,
      """Latitude defining the portal's bottom boundary. Default: \`-90\`."""
      bottom: Float,
      """Longitude defining the portal's right boundary. Default: \`180\`."""
      right: Float
    ): GeoAggregation
  }
`

module.exports = typeDefs
