const geoRegionNames = require('./names')
const ES_FIELD_GEO_POINT = 'postcodeGeoPoint'
const ES_FIELD = 'postcodeGeo.codes.rgn'
const NUM_VALUES = Object.keys(geoRegionNames).length
const AGG_NAME = 'agg_geo_region' // distinct from other agg names to allow combining agg queries

async function aggGeoRegion(search, { top, left, bottom, right }) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        [AGG_NAME]: {
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
    const buckets = response.aggregations[AGG_NAME].agg2.buckets.map(x => ({
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
