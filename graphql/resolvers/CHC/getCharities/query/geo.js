const GEO_FIELD = 'contact.geoCoords'

const getGeoFilters = geo => {
  if (!geo) return []

  const filters = []

  if (geo.boundingBox) {
    filters.push({
      geo_bounding_box: {
        [GEO_FIELD]: geo.boundingBox,
      },
    })
  }

  if (geo.boundingCircle) {
    filters.push({
      geo_distance: {
        distance: `${geo.boundingCircle.radius}${geo.boundingCircle.unit}`,
        [GEO_FIELD]: {
          lat: geo.boundingCircle.latitude,
          lon: geo.boundingCircle.longitude,
        },
      },
    })
  }

  return filters
}

module.exports = getGeoFilters
