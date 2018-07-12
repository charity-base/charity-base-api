const { extractValues, extractValuesGivenLength } = require('./helpers')

const parseIncomeRange = query => {
  const [min, max] = extractValuesGivenLength(query['incomeRange'], 2)
  const rangeQuery = {}
  if (min && Number(min)) {
    rangeQuery.gte = Number(min)
  }
  if (max && Number(max)) {
    rangeQuery.lt = Number(max)
  }
  const isEmpty = Object.keys(rangeQuery).length === 0
  return isEmpty ? [] : [{ range: { 'income.latest.total' : rangeQuery } }]
}

const parseAddressWithin = query => {
  const [distance, lat, lon] = extractValuesGivenLength(query['addressWithin'], 3)
  const geo_coords = `${lat},${lon}`
  return !distance ? [] : [{ geo_distance : { distance, geo_coords } }]
}

const parseAreasOfOperation = query => {
  const ids = extractValues(query['areasOfOperation.id'])
  return ids.map(id => ({ "match_phrase": { "areasOfOperation.id": id }}))
}

const parseCauses = query => {
  const ids = extractValues(query['causes.id'])
  return ids.map(id => ({ "term": { "causes.id": id }}))
}

const parseBeneficiaries = query => {
  const ids = extractValues(query['beneficiaries.id'])
  return ids.map(id => ({ "term": { "beneficiaries.id": id }}))
}

const parseOperations = query => {
  const ids = extractValues(query['operations.id'])
  return ids.map(id => ({ "term": { "operations.id": id }}))
}

const parseId = query => {
  const charityId = query['ids.GB-CHC']
  return charityId ? [{ "term": { "ids.GB-CHC": charityId }}] : []
}

const parseFunders = query => {
  const funders = extractValues(query['funders'])
  return funders.map(id => ({ "match_phrase": { "grants.fundingOrganization.id": id }}))
}

const parseHasGrant = query => {
  const hasGrant = extractValues(query['hasGrant'])
  return hasGrant.length > 0 ? [{ "exists" : { "field" : "grants" } }] : []
}

const parseGrantDateRange = query => {
  const [min, max] = extractValuesGivenLength(query['grantDateRange'], 2)
  const rangeQuery = {}
  if (min && new Date(min)) {
    rangeQuery.gte = min
  }
  if (max && new Date(max)) {
    rangeQuery.lt = max
  }
  const isEmpty = Object.keys(rangeQuery).length === 0
  return isEmpty ? [] : [{ range: { 'grants.awardDate' : rangeQuery } }]
}

const parseFilter = query => {

  filter = [
    ...parseId(query),
    ...parseIncomeRange(query),
    ...parseAddressWithin(query),
    ...parseAreasOfOperation(query),
    ...parseCauses(query),
    ...parseBeneficiaries(query),
    ...parseOperations(query),
    ...parseFunders(query),
    ...parseHasGrant(query),
    ...parseGrantDateRange(query),
  ]

  return filter
}

module.exports = parseFilter
