// allow getting nested field from object with dot notation e.g. getNestedField({ a: { b: 'hello' } }, 'a.b')
const getNestedField = (obj, field) => (
  field.split('.').reduce((acc, part) => acc ? acc[part] : '', obj)
)

module.exports = getNestedField
