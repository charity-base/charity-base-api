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

const parseFilter = query => {

  const incomeFilters = parseIncomeRange(query)
  const geoFilters = parseAddressWithin(query)
  const areasOfOperationFilters = parseAreasOfOperation(query)
  const causesFilters = parseCauses(query)
  const beneficiariesFilters = parseBeneficiaries(query)
  const operationsFilters = parseOperations(query)

  filter = [
    ...incomeFilters,
    ...geoFilters,
    ...areasOfOperationFilters,
    ...causesFilters,
    ...beneficiariesFilters,
    ...operationsFilters,
  ]

  return filter
}

module.exports = parseFilter
