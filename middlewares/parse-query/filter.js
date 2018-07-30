const { extractValues, extractValuesGivenLength, normaliseLongitude } = require('./helpers')

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
  if (distance) {
    return [{ geo_distance : { distance, geo_coords } }]
  }
  const [minLat, minLon, maxLat, maxLon] = extractValuesGivenLength(query['addressWithin'], 4).map(Number)
  if (!isNaN(minLat)) {
    return [{
      geo_bounding_box : {
        geo_coords: {
          top_left: {
            lat: minLat || 90,
            lon: normaliseLongitude(minLon) || -180,
          },
          bottom_right: {
            lat: maxLat || -90,
            lon: normaliseLongitude(maxLon) || 180,
          }
        }
      }
    }]
  }
  return []
}

const parseAreasOfOperation = query => {
  const ids = extractValues(query['areasOfOperation.id'])
  return [{
    bool: {
      should: ids.map(id => ({
        "match_phrase": { "areasOfOperation.id": id }
      }))
    }
  }]
}

const parseCauses = query => {
  const ids = extractValues(query['causes.id'])
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "causes.id": id }
      }))
    }
  }]
}

const parseBeneficiaries = query => {
  const ids = extractValues(query['beneficiaries.id'])
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "beneficiaries.id": id }
      }))
    }
  }]
}

const parseOperations = query => {
  const ids = extractValues(query['operations.id'])
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "operations.id": id }
      }))
    }
  }]
}

const parseId = query => {
  const ids = extractValues(query['ids.GB-CHC']).map(Number)
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "ids.GB-CHC": id }
      }))
    }
  }]
}

const parseFunders = query => {
  const ids = extractValues(query['funders'])
  return ids.length > 0 ? [{
    bool: {
      should: ids.map(id => ({
        "match_phrase": { "grants.fundingOrganization.id": id }
      }))
    }
  }] : []
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

  const grantsFilters = [
    ...parseFunders(query),
    ...parseGrantDateRange(query),
  ]

  const nestedFilters = grantsFilters.length > 0 ? [{
    nested : {
      path : 'grants',
      query : {
        bool : {
          filter: grantsFilters
        }
      }
    }
  }] : []

  filter = [
    ...parseId(query),
    ...parseIncomeRange(query),
    ...parseAddressWithin(query),
    ...parseAreasOfOperation(query),
    ...parseCauses(query),
    ...parseBeneficiaries(query),
    ...parseOperations(query),
    ...parseHasGrant(query),
    ...nestedFilters,
  ]

  return filter
}

module.exports = parseFilter
