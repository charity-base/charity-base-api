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

module.exports = { extractValues, extractValuesGivenLength, numberOrDefault }
