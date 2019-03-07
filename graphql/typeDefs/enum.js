const typeDefs = `
  """
  Unit of distance.  Allowed values are \`mi\` (miles), \`yd\` (yards), \`km\` (kilometres) or \`m\` (metres).
  """
  enum DistanceUnit {
    """miles"""
    mi
    """yards"""
    yd
    """kilometres"""
    km
    """metres"""
    m
  }

  enum GeoRegion {
    E12000001
    E12000002
    E12000003
    E12000004
    E12000005
    E12000006
    E12000007
    E12000008
    E12000009
  }
`

module.exports = typeDefs
