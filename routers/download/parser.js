const { getDescendantProp } = require('./helpers')

const getJSONParser = () => esObj => {
  return `${JSON.stringify(esObj._source)}\n`
}

const getCSVParser = fieldPaths => esObj => {
  if (!fieldPaths || fieldPaths.length === 0) return `\n`
  const values = fieldPaths.map(getDescendantProp(esObj._source))
  const stringValues = values.map(x => typeof x === 'string' ? x : JSON.stringify(x))
  const cleanValues = stringValues.map(x => x.replace(/"/g, `""`))
  return `"${cleanValues.join(`","`)}"\n`
}

const getParser = (fileType, fieldPaths) => {
  switch (fileType) {
    case 'JSON':
      return getJSONParser()
    case 'CSV':
      return getCSVParser(fieldPaths)
    default:
      return getCSVParser(fieldPaths)
  }
}

module.exports = getParser
