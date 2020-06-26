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
    funder: IdName
    fundingOrganization: [IdName] @deprecated(reason: "Use \`funder\` instead.")
    amountAwarded: Float
    currency: String
    awardDate: Date
  }

  type Funding {
    funders: [IdName]
    grants: [Grant]
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

  type SocialMediaHandle {
    platform: SocialPlatform
    handle: String
  }

  type ContactCHC {
    address: [String]
    email: String
    person: String @deprecated(reason: "The Charity Commission stopped sharing this information.")
    phone: String
    postcode: String
    social: [SocialMediaHandle]
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

  type TrusteeCharityCHC {
    id: ID
    name: String
  }

  type TrusteeCHC {
    id: ID
    name: String
    trusteeships: Int
    otherCharities: [TrusteeCharityCHC]
  }

  type LogoImage {
    """
    URL of a small logo suitable for rendering in a list of charity avatars. The exact dimensions may vary.  URL is valid for 24 hours after the request.
    """
    small: String
    """
    URL of a medium logo suitable for rendering in a charity profile page. The exact dimensions may vary.  URL is valid for 24 hours after the request.
    """
    medium: String
  }

  type Image {
    logo: LogoImage
  }

  """
  Thematic category auto-generated using topic modelling.
  **Warning:** this feature is experimental and the topics are dynamic.
  Both their names and ids are likely to change each month.
  """
  type Topic {
    """
    Topic ID.
    **Warning:** topics are dynamic so a particular ID might not exist in the future.
    Use \`CHC.getFilters\` to search currently available topics.
    """
    id: ID
    """
    A space-separated list of words relevant to the topic.
    """
    name: String
    """
    A numerical value between \`0\` and \`1\`.
    A high value corresponds to a high likelihood that the topic is relevant to the Charity.
    """
    score: Float
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
    funding: Funding
    grants: [Grant] @deprecated(reason: "Use \`funding.grants\` instead.")
    geo: Geo
    contact: ContactCHC
    website: String
    trustees: [TrusteeCHC]
    governingDoc: String
    objectives: String
    numPeople: PeopleCHC
    orgIds: [OrgId]
    financialYearEnd: String
    registrations(
      """If \`true\` then all previous registrations are returned"""
      all: Boolean = false
    ): [RegistrationCHC]
    image: Image
    topics: [Topic]
  }
`

module.exports = typeDefs
