const getNestedField = require('./getNestedField')
const fieldsMap = require('./fieldsMap')

const reqFieldsList = reqFieldsObj => {
  return Object.keys(reqFieldsObj).filter(x => fieldsMap[x])
}

// This could be further optimised by just fetching requested sub fields
const getSourceFields = requestedFields => {
  return reqFieldsList(requestedFields).reduce((agg, x) => [
      ...agg,
      ...fieldsMap[x].fields,
    ], [])
}

const getGqlFieldValue = (gqlField, esDoc) => fieldsMap[gqlField].resolveValues(
  fieldsMap[gqlField].fields.map(esField => getNestedField(esDoc._source, esField))
)

const mapDocToGraphQL = (doc, requestedFields) => {
  return reqFieldsList(requestedFields).reduce((agg, x) => ({
    ...agg,
    [x]: getGqlFieldValue(x, doc)
  }), {})
}

module.exports = {
  getSourceFields,
  mapDocToGraphQL
}
