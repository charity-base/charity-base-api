const geoCountryNames = require('./names')
const AGG_NAME = 'geo_country'
const AGG_NAME_NESTED = 'geo_country_nested'
const GEO_COORDS_ES_FIELD = 'contact.geoCoords'
const ES_FIELD = 'contact.geo.country'
const NUM_VALUES = 7

async function aggGeoCountry(search, { top, left, bottom, right }) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        [AGG_NAME]: {
          filter: {
            geo_bounding_box: {
              [GEO_COORDS_ES_FIELD]: { top, left, bottom, right },
            },
          },
          aggs: {
            [AGG_NAME_NESTED]: {
              terms: {
                field: ES_FIELD,
                size: NUM_VALUES,
              }
            }
          },
        }
      }
    },
    size: 0,
  }
  try {
    const response = await search(searchParams)
    const buckets = response.aggregations[AGG_NAME][AGG_NAME_NESTED].buckets.map(x => ({
      id: `${x.key}`,
      key: geoCountryNames[x.key] || x.key,
      name: `${x.key}`,
      count: x.doc_count,
    }))
    return {
      buckets,
    }
  } catch(e) {
    throw e
  }
}

module.exports = aggGeoCountry
