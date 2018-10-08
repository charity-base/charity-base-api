const ALLOWED_CSV_FIELD_PATHS = [
  'ids.GB-CHC',
  'ids.charityId',
  'name',
  'contact.address',
  'contact.email',
  'contact.geo.latitude',
  'contact.geo.longitude',
  'contact.person',
  'contact.phone',
  'contact.postcode',
  'people.volunteers',
  'people.employees',
  'people.trustees',
  'activities',
  'website',
  'income.annual',
  'areaOfBenefit',
  'causes',
  'beneficiaries',
  'operations',
  'objectives',
  'registration',
]

const FY_END_YEARS = [
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
]

module.exports = {
  ALLOWED_CSV_FIELD_PATHS,
  FY_END_YEARS,
}
