const geohashBounds = require("./geohashBounds")

const GEO_COUNTRY_FIELD = "postcodeGeo.codes.ctry"
const GEO_REGION_FIELD = "postcodeGeo.codes.rgn"
const GEO_COORDS_FIELD = "postcodeGeoPoint"
const GEO_LAUA_FIELD = "postcodeGeo.codes.laua"

const getGeoFilters = (geo) => {
  if (!geo) return []

  const filters = []

  if (geo.boundingBox) {
    filters.push({
      geo_bounding_box: {
        [GEO_COORDS_FIELD]: geo.boundingBox,
      },
    })
  }

  if (geo.geohashes) {
    filters.push({
      bool: {
        should: geo.geohashes.map((geohash) => ({
          geo_bounding_box: {
            [GEO_COORDS_FIELD]: geohashBounds(geohash),
          },
        })),
      },
    })
  }

  if (geo.boundingCircle) {
    filters.push({
      geo_distance: {
        distance: `${geo.boundingCircle.radius}${geo.boundingCircle.unit}`,
        [GEO_COORDS_FIELD]: {
          lat: geo.boundingCircle.latitude,
          lon: geo.boundingCircle.longitude,
        },
      },
    })
  }

  if (geo.region) {
    filters.push({
      term: {
        [GEO_REGION_FIELD]: geo.region,
      },
    })
  }

  if (geo.country) {
    filters.push({
      term: {
        [GEO_COUNTRY_FIELD]: geo.country,
      },
    })
  }

  // should we make this an array to allow filtering by multiple?
  if (geo.laua) {
    filters.push({
      term: {
        [GEO_LAUA_FIELD]: geo.laua,
      },
    })
  }

  return filters
}

module.exports = getGeoFilters
