const defaultConversion = fieldValues => {
  if (fieldValues.length === 1) return fieldValues[0]
  return fieldValues
}

class FieldsMapper {
  constructor(esFields, esValsToGql=defaultConversion) {
    if (!esFields || !esFields.length) throw new Error('Please supply a non-trivial list')
    this.esFields = esFields
    this.esValsToGql = esValsToGql
  }
  get fields() {
    return this.esFields
  }
  resolveValues(fieldValues) {
    if (!fieldValues || !fieldValues.length) throw new Error('Please supply a non-trivial list')
    if (fieldValues.length !== this.fields.length) throw new Error('List of values must be of same length as list of field names supplied when initializing class')
    return this.esValsToGql(fieldValues)
  }
}

module.exports = FieldsMapper
