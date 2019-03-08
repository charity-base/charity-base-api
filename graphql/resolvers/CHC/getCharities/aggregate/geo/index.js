const geohashPrecision = require('./geohashPrecision')
const geoBoundingBox = require('./geoBoundingBox')
const geoRegionNames = require('./geoRegionNames')
const GEO_REGION_FIELD = 'contact.geo.region'
const GEO_COORDS_FIELD = 'contact.geoCoords'
const GEO_AGG_TYPES = [
  'geohash',
  'region',
] // reflects the fields on type GeoAggregation

const getBucketKey = (key, aggType) => {
  if (aggType === 'region') {
    return geoRegionNames[key] || key
  }
  return `${key}`
}

const getBucketName = (key, aggType) => {
  return `${key}`
}

const aggQuery = graphQLFields => {
  if (!graphQLFields) return undefined

  const args = graphQLFields.__arguments
  const bbox = geoBoundingBox(args)
  
  const geoAggs = {
    filter: {
      geo_bounding_box: {
        [GEO_COORDS_FIELD]: bbox,
      },
    },
    aggs: {}
  }

  if (graphQLFields.geohash) {
    geoAggs.aggs.geohash = {
      geohash_grid: {
        field: GEO_COORDS_FIELD,
        precision: geohashPrecision(bbox),
      }
    }
  }

  if (graphQLFields.region) {
    geoAggs.aggs.region = {
      terms: {
        field: GEO_REGION_FIELD,
        size: 9,
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
        id: getBucketKey(x.key, aggType),
        key: getBucketKey(x.key, aggType),
        name: getBucketName(x.key, aggType),
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
