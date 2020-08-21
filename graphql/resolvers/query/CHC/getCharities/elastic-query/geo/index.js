const geohashBounds = require('./geohashBounds')

const GEO_COUNTRY_FIELD = 'contact.geo.country'
const GEO_REGION_FIELD = 'contact.geo.region'
const GEO_COORDS_FIELD = 'contact.geoCoords'

const geoRegionCodes = {
  E12000001: 'North East',
  E12000002: 'North West',
  E12000003: 'Yorkshire and The Humber',
  E12000004: 'East Midlands',
  E12000005: 'West Midlands',
  E12000006: 'East of England',
  E12000007: 'London',
  E12000008: 'South East',
  E12000009: 'South West',
  W99999999: 'Wales',
}

const geoCountryCodes = {
  E92000001: 'England',
  K02000001: 'United Kingdom',
  K03000001: 'Great Britain',
  K04000001: 'England and Wales',
  N92000002: 'Northern Ireland',
  S92000003: 'Scotland',
  W92000004: 'Wales',
}

const getGeoFilters = geo => {
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
        should: geo.geohashes.map(geohash => ({
          geo_bounding_box: {
            [GEO_COORDS_FIELD]: geohashBounds(geohash),
          },
        }))
      }
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
    const geoRegionName = geoRegionCodes[geo.region]
    filters.push({
      term: {
        [GEO_REGION_FIELD]: geoRegionName,
      },
    })
  }

  if (geo.country) {
    const geoCountryName = geoCountryCodes[geo.country]
    filters.push({
      term: {
        [GEO_COUNTRY_FIELD]: geoCountryName,
      },
    })
  }

  return filters
}

module.exports = getGeoFilters
