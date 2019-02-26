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
`

module.exports = typeDefs
