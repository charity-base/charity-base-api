const getGeoFilters = geo => {
  if (!geo) return []

  const filters = []

  if (geo.boundingBox) {
    filters.push({
      geo_bounding_box: {
        'contact.geoCoords': geo.boundingBox,
      },
    })
  }

  return filters
}

module.exports = getGeoFilters
