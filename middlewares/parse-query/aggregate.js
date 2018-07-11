const { extractValues } = require('./helpers')

const parseFunders = query => {
  const funders = extractValues(query['funders'])
  return funders.map(id => ({ 'match_phrase': { 'grants.fundingOrganization.id': id }}))
}

const getAggs = grantFilters => ({
  'addressLocation': {
    'geohash_grid': {
      'field': 'geo_coords',
      'precision': '20km'
    }
  },
  'size':{
     'histogram':{ 
        'field': 'income.latest.total',
        'script': 'Math.log10(_value)',
        'interval': 0.5,
     },
     'aggs':{
        'grants': {
          'nested' : {
            'path' : 'grants'
          },
          aggs: {
            'filtered_grants': {
              filter: {
                bool: {
                  should: grantFilters
                }
              },
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
  },
  funders: {
    nested: { path: 'grants' },
    aggs: {
       'filtered_grants': {
         filter: {
           bool: {
             should: grantFilters
           }
         },
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


const getQuery = () => (req, res, next) => {

  const grantFilters = parseFunders(req.query)
  res.locals.elasticSearchAggs = getAggs(grantFilters)
  return next()
}

module.exports = getQuery
