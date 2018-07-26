const extractValues = x => {
  const isString = typeof x === 'string'
  return isString && x.length ? x.split(',') : []
}

const extractValuesGivenLength = (x, numberOfValues) => {
  const values = extractValues(x)
  const isCorrectLength = values.length === numberOfValues
  return isCorrectLength ? values : new Array(numberOfValues)
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

module.exports = { extractValues, extractValuesGivenLength, numberOrDefault, normaliseLongitude }
