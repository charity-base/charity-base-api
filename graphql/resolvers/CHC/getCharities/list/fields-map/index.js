const getNestedField = require('./getNestedField')
const fieldsMap = require('./fieldsMap')

// This could be further optimised by just fetching requested sub fields
const getSourceFields = requestedFields => {
  return Object.keys(requestedFields).reduce((agg, x) => [
    ...agg,
    ...fieldsMap[x].fields,
  ], [])
}

const mapDocToGraphQL = (doc, requestedFields) => {
  const docValues = Object.keys(requestedFields).reduce((agg, x) => ({
    ...agg,
    [x]: fieldsMap[x].fields.map(esField => getNestedField(doc._source, esField))
  }), {})
  return Object.keys(requestedFields).reduce((agg, x) => ({
    ...agg,
    [x]: fieldsMap[x].resolveValues(docValues[x])
  }), {})
}

module.exports = {
  getSourceFields,
  mapDocToGraphQL
}
