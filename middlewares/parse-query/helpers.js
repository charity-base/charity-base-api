const extractValues = x => {
  const isString = typeof x === 'string'
  return isString && x.length ? x.split(',') : []
}

const extractValuesGivenLength = (x, numberOfValues) => {
  const values = extractValues(x)
  const isCorrectLength = values.length === numberOfValues
  return isCorrectLength ? values : [...(new Array(numberOfValues))]
}

const numberOrDefault = (x, fallback) => {
  const isNotNumberable = (x === null) || isNaN(Number(x))
  return isNotNumberable ? fallback : Number(x)
}

const normaliseLongitude = lon => {
  if (lon > 180) {
    return lon - 360
  }
  if (lon < -180) {
    return lon + 360
  }
  return lon
}

const getGeoBoundingBox = coordsString => {
  const defaultCoords = [90, -180, -90, 180]
  const coords = extractValuesGivenLength(coordsString, 4)
  .map((x, i) => isNaN(Number(x)) ? defaultCoords[i] : Number(x))
  return {
    top_left: {
      lat: coords[0], // max latitude
      lon: normaliseLongitude(coords[1]), // min longitude
    },
    bottom_right: {
      lat: coords[2], // min latitude
      lon: normaliseLongitude(coords[3]), // max longitude
    }
  }
}

module.exports = { extractValues, extractValuesGivenLength, numberOrDefault, getGeoBoundingBox }
