const typeDefs = `
  scalar Date

  type IncomeLatestCHC {
    "End date of latest financial year"
    date: Date
    "Latest gross income GBP"
    total: Float
  }

  type FinancialYear {
    begin: Date
    end: Date
  }

  type IncomeAnnualCHC {
    income: Float
    expend: Float
    financialYear: FinancialYear
  }

  type IncomeCHC {
    latest: IncomeLatestCHC
    annual: [IncomeAnnualCHC]
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
    awardDate: Date
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

  type ContactCHC {
    address: [String]
    email: String
    person: String
    phone: String
    postcode: String
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
    Alternative working names of the charity
    """
    alternativeNames: [String]
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
    contact: ContactCHC
    website: String
    governingDoc: String
  }
`

module.exports = typeDefs
