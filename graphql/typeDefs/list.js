const typeDefs = `
  scalar Date

  type FinancialYear {
    begin: Date
    end: Date
  }

  type FinancialCHC {
    income: Float
    spending: Float
    financialYear: FinancialYear
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
    person: String @deprecated(reason: "The Charity Commission stopped sharing this information.")
    phone: String
    postcode: String
  }

  type PeopleCHC {
    employees: Int
    trustees: Int
    volunteers: Int
  }

  type OrgId {
    id: ID
    scheme: String
    rawId: String
  }

  type Name {
    value: String
    primary: Boolean
  }

  type RegistrationCHC {
    registrationDate: Date
    removalDate: Date
    removalCode: String
    removalReason: String
  }

  """
  Charity registered in England & Wales
  """
  type CharityCHC {
    id: ID
    """
    Registered name of the charity
    """
    name: String @deprecated(reason: "Use \`names\` instead.")
    names(
      """If \`true\` then all working names are returned"""
      all: Boolean = false
    ): [Name]
    """
    Short description of the charity's activities
    """
    activities: String
    finances(
      """If \`true\` then all annual finances are returned"""
      all: Boolean = false
    ): [FinancialCHC]
    areas: [IdName]
    areaOfBenefit: String
    causes: [IdName]
    beneficiaries: [IdName]
    operations: [IdName]
    grants: [Grant]
    geo: Geo
    contact: ContactCHC
    website: String
    governingDoc: String
    objectives: String
    numPeople: PeopleCHC
    orgIds: [OrgId]
    financialYearEnd: String
    registrations(
      """If \`true\` then all previous registrations are returned"""
      all: Boolean = false
    ): [RegistrationCHC]
  }
`

module.exports = typeDefs
