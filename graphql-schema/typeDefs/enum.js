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
    "North East"
    E12000001
    "North West"
    E12000002
    "Yorkshire and The Humber"
    E12000003
    "East Midlands"
    E12000004
    "West Midlands"
    E12000005
    "East of England"
    E12000006
    "London"
    E12000007
    "South East"
    E12000008
    "South West"
    E12000009
    "Wales (Pseudo)"
    W99999999
  }

  enum GeoCountry {
    "England"
    E92000001
    # "United Kingdom"
    # K02000001
    # "Great Britain"
    # K03000001
    # "England and Wales"
    # K04000001
    "Northern Ireland"
    N92000002
    "Scotland"
    S92000003
    "Wales"
    W92000004
  }

  enum SortCHC {
    age_asc
    age_desc
    default
    income_asc
    income_desc
    random
    spending_asc
    spending_desc
  }

  enum SocialPlatform {
    facebook
    instagram
    twitter
  }
`

module.exports = typeDefs
