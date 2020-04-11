const geoRegionNames = require('./names')
const ES_FIELD_GEO_POINT = 'postcodeGeoPoint'
const ES_FIELD = 'postcodeGeo.codes.rgn'
const NUM_VALUES = Object.keys(geoRegionNames).length

async function aggGeoRegion(search, { top, left, bottom, right }) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        agg1: {
          filter: {
            geo_bounding_box: {
              [ES_FIELD_GEO_POINT]: { top, left, bottom, right },
            },
          },
          aggs: {
            agg2: {
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
    const buckets = response.aggregations.agg1.agg2.buckets.map(x => ({
      key: x.key,
      name: geoRegionNames[x.key] || x.key,
      count: x.doc_count,
      sum: null,
    }))
    return {
      buckets,
    }
  } catch(e) {
    throw e
  }
}

module.exports = aggGeoRegion
