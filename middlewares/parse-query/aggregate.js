const { extractValues, extractValuesGivenLength, normaliseLongitude } = require('./helpers')

const parseFunders = query => {
  const funders = extractValues(query['funders'])
  return funders.map(id => ({ 'match_phrase': { 'grants.fundingOrganization.id': id }}))
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

const getGeoBoundingBox = query => {
  const bounds = extractValuesGivenLength(query['geoBounds'], 4).map(Number)
  const geoBounds = {
    'geo_coords': {
      'top_left': {
        'lat': bounds[0] || 90,
        'lon': normaliseLongitude(bounds[1]) || -180,
      },
      'bottom_right': {
        'lat': bounds[2] || -90,
        'lon': normaliseLongitude(bounds[3]) || 180,
      }
    }
  }
  return geoBounds
}

const getDistanceMeasure = latDiff => {
  const latDiffRadians = latDiff * Math.PI / 180
  const d = Math.atan2(Math.sin(0.5*latDiffRadians), Math.cos(0.5*latDiffRadians))
  return d
}

const gridPrecision = latDiff => {
  const precision = Math.min(getDistanceMeasure(latDiff)*10000, 1500)
  return `${precision}km`
}

const getCategoriesAggs = () => ({
  'causes' : {
    'terms' : { 'field' : 'causes.id', 'size' : 17 }
  },
  'beneficiaries' : {
    'terms' : { 'field' : 'beneficiaries.id', size: 7 }
  },
  'operations' : {
    'terms' : { 'field' : 'operations.id', size: 10 }
  },
})

const getFundersAggs = grantsFilter => ({
  funders: {
    nested: { path: 'grants' },
    aggs: {
       'filtered_grants': {
         filter: grantsFilter,
         aggs: {
           funders: {
             terms: { field: 'grants.fundingOrganization.id', size : 80 },
             aggs: {
               'total_awarded': {
                  'sum': { 
                    'field' : 'grants.amountAwarded'
                  }
                },
             },
           }
         }
       },
    }
  },
})

const getIncomeAggs = grantsFilter => ({
  'size': {
    'histogram': {
      'field': 'income.latest.total',
      'script': 'Math.log10(_value)',
      'interval': 0.5,
      'extended_bounds' : {
        'min' : 0,
        'max' : 9,
      }
    },
    'aggs': {
      'grants': {
        'nested' : {
          'path' : 'grants'
        },
        aggs: {
          'filtered_grants': {
            filter: grantsFilter,
            aggs: {
              'grants_sum': {
                'sum': {
                'field' : 'grants.amountAwarded'
                }
              },
            }
          },
        }
      },
      'total_income': {
        'sum': {
          'field' : 'income.latest.total'
        }
      },
    },
  }
})

const getGeoAggs = geoBounds => ({
  'addressLocation': {
    filter: {
      'geo_bounding_box': geoBounds,
    },
    aggs: {
      grid: {
        'geohash_grid': {
          'field': 'geo_coords',
          'precision': gridPrecision(geoBounds.geo_coords.top_left.lat - geoBounds.geo_coords.bottom_right.lat),
        }
      },
      'map_zoom': {
        'geo_bounds': {
          'field': 'geo_coords',
        },
      },
    },
  },
})


const getAggs = (query, aggTypes, grantsFilter, geoBounds) => ({
  ...(aggTypes.indexOf('geo') > -1 && getGeoAggs(geoBounds)),
  ...(aggTypes.indexOf('income') > -1 && getIncomeAggs(grantsFilter)),
  ...(aggTypes.indexOf('funders') > -1 && getFundersAggs(grantsFilter)),
  ...(aggTypes.indexOf('categories') > -1 && getCategoriesAggs()),
})


const getQuery = () => (req, res, next) => {

  const grantsFilter = {
    bool: {
      should: parseFunders(req.query),
      filter: parseGrantDateRange(req.query),
    }
  }

  const aggTypes = req.query.aggTypes ? extractValues(req.query.aggTypes) : ['geo', 'income', 'funders', 'categories']

  const geoBounds = getGeoBoundingBox(req.query)

  res.locals.elasticSearchAggs = getAggs(req.query, aggTypes, grantsFilter, geoBounds)
  return next()
}

module.exports = getQuery
