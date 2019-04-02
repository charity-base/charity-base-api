const precision = require('./precision')
const AGG_NAME = 'geo_geohash'
const AGG_NAME_NESTED = 'geo_geohash_nested'
const ES_FIELD = 'contact.geoCoords'

async function aggGeohash(search, { top, left, bottom, right }) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        [AGG_NAME]: {
          filter: {
            geo_bounding_box: {
              [ES_FIELD]: { top, left, bottom, right },
            },
          },
          aggs: {
            [AGG_NAME_NESTED]: {
              geohash_grid: {
                field: ES_FIELD,
                precision: precision({ top, left, bottom, right }),
              },
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
      key: `${x.key}`,
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

module.exports = aggGeohash
