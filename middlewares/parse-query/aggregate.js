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
  const bounds = extractValuesGivenLength(query['aggGeoBounds'], 4).map(Number)
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

const getGeoPrecision = query => {
  const geoPrecision = query['aggGeoPrecision'] || 3
  return geoPrecision
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

const getGrantIncomeAggs = grantsFilter => ({
  grantSize: {
    nested: { path: 'grants' },
    aggs: {
      'filtered_grants': {
        filter: grantsFilter,
        aggs: {
          grantSize: {
            'histogram': {
              'field': 'grants.amountAwarded',
              'script': 'Math.log10(_value)',
              'interval': 0.5,
              'extended_bounds' : {
                'min' : 0,
                'max' : 9,
              },
            },
            aggs: {
              'total_awarded': {
                'sum': {
                  'field' : 'grants.amountAwarded'
                },
              },
            },
          },
        },
      },
    },
  },
})

const getGrantDateAggs = grantsFilter => ({
  grantDate: {
    nested: { path: 'grants' },
    aggs: {
      'filtered_grants': {
        filter: grantsFilter,
        aggs: {
          grantDate: {
            'date_histogram': {
              'field': 'grants.awardDate',
              'interval': 'month',
              'format' : 'yyyy-MM',
            },
            aggs: {
              'total_awarded': {
                'sum': {
                  'field' : 'grants.amountAwarded'
                },
              },
            },
          },
        },
      },
    },
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
      'total_income': {
        'sum': {
          'field' : 'income.latest.total'
        }
      },
    },
  }
})

const getGeoAggs = (geoBounds, geoPrecision) => ({
  'addressLocation': {
    filter: {
      'geo_bounding_box': geoBounds,
    },
    aggs: {
      grid: {
        'geohash_grid': {
          'field': 'geo_coords',
          'precision': geoPrecision,
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


const getAggs = (query, aggTypes, grantsFilter, geoBounds, geoPrecision) => ({
  ...(aggTypes.indexOf('geo') > -1 && getGeoAggs(geoBounds, geoPrecision)),
  ...(aggTypes.indexOf('income') > -1 && getIncomeAggs(grantsFilter)),
  ...(aggTypes.indexOf('grantSize') > -1 && getGrantIncomeAggs(grantsFilter)),
  ...(aggTypes.indexOf('grantDate') > -1 && getGrantDateAggs(grantsFilter)),
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

  const aggTypes = req.query.aggTypes ? extractValues(req.query.aggTypes) : ['geo', 'income', 'grantSize', 'grantDate', 'funders', 'categories']

  const geoBounds = getGeoBoundingBox(req.query)
  const geoPrecision = getGeoPrecision(req.query)

  res.locals.elasticSearchAggs = getAggs(req.query, aggTypes, grantsFilter, geoBounds, geoPrecision)
  return next()
}

module.exports = getQuery
