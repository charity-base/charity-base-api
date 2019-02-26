const MIN_GRID_BUCKETS = 50
const MAX_PRECISION = 10

const radians = x => x*Math.PI/180

const getArea = (lat1, lat2, lonDiff) => {
  const dimensionlessArea = radians(lonDiff)*(Math.sin(radians(lat1)) - Math.sin(radians(lat2)))
  return Math.abs(dimensionlessArea)
}

const geohashLatRange = p => {
  return 180/Math.pow(2, Math.floor(5*p/2))
}
const geohashLonRange = p => {
  return 360/Math.pow(2, Math.ceil(5*p/2))
}

const geohashPrecision = ({ top, left, bottom, right }) => {
  const portalArea = getArea(top, bottom, right-left)
  const avgLat = 0.5*(top + bottom)

  for (var p = 1; p < MAX_PRECISION; p++) {
    const lonRange = geohashLonRange(p)
    const latRange = geohashLatRange(p)
    const lat1 = avgLat + 0.5*latRange
    const lat2 = avgLat - 0.5*latRange
    const avgGeohashArea = getArea(lat1, lat2, lonRange)

    if (MIN_GRID_BUCKETS*avgGeohashArea < portalArea) {
      return p
    }
  }

  return MAX_PRECISION
}

module.exports = geohashPrecision
