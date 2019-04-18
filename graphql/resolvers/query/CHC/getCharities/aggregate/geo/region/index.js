const geoRegionNames = require('./names')
const AGG_NAME = 'geo_region'
const AGG_NAME_NESTED = 'geo_region_nested'
const GEO_COORDS_ES_FIELD = 'contact.geoCoords'
const ES_FIELD = 'contact.geo.region'
const NUM_VALUES = 9

async function aggGeoRegion(search, { top, left, bottom, right }) {
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
      key: geoRegionNames[x.key] || x.key,
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

module.exports = aggGeoRegion
