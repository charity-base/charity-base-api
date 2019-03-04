const geohashPrecision = require('./geohashPrecision')
const geoBoundingBox = require('./geoBoundingBox')
const GEO_FIELD = 'contact.geoCoords'
const GEO_AGG_TYPES = [
  'geohash'
] // reflects enum type GeoAggregationType

const aggQuery = graphQLFields => {
  if (!graphQLFields) return undefined

  const args = graphQLFields.__arguments
  const bbox = geoBoundingBox(args)
  
  const geoAggs = {
    filter: {
      geo_bounding_box: {
        [GEO_FIELD]: bbox,
      },
    },
    aggs: {}
  }

  if (graphQLFields.geohash) {
    geoAggs.aggs.geohash = {
      geohash_grid: {
        field: GEO_FIELD,
        precision: geohashPrecision(bbox),
      }
    }
  }

  return Object.keys(geoAggs.aggs).length > 0 ? geoAggs : undefined
}

const parseResponse = aggregation => {
  const aggTypes = Object.keys(aggregation).filter(x => GEO_AGG_TYPES.indexOf(x) !== -1)
  const geoBuckets = aggTypes.reduce((combinedAggs, aggType) => ({
    ...combinedAggs,
    [aggType]: {
      buckets: aggregation[aggType].buckets.map(x => ({
        id: `${x.key}`,
        key: `${x.key}`,
        name: `${x.key}`,
        count: x.doc_count,
        sumIncome: null, // remove this from bucket type?
      }))
    }
  }), {})

  return geoBuckets
}

module.exports = {
  aggQuery,
  parseResponse,
}
