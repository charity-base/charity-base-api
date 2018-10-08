const { getDescendantProp } = require('./helpers')
const { FY_END_YEARS } = require('./constants')

const getJSONParser = () => esObj => {
  return `${JSON.stringify(esObj._source)}\n`
}

const getAnnualIncomeObj = (annuals, year) => {
  return annuals.find(
    ({ financialYear }) => financialYear.end && new Date(financialYear.end).getFullYear() === year
  ) || {
    income: null,
    expend: null,
  }
}

const getLatestRegDate = registrations => {
  const regObj = registrations.find(
    ({ removed }) => !removed
  )
  const regDate = regObj ? (
    new Date(regObj.registered)
  ) : null
  return regDate ? (
    `${regDate.getFullYear()}-${('0' + (regDate.getMonth() + 1)).slice(-2)}-${('0' + regDate.getDate()).slice(-2)}`
  ) : null
}

const valuesWithRegDate = (fields, values) => {
  const i = fields.indexOf('registration')
  if (i === -1) {
    return values
  }
  return [
    ...values.slice(0, i),
    getLatestRegDate(values[i]),
    ...values.slice(i + 1),
  ]
}

const valuesWithIncome = (fields, values) => {
  // Warning: this function returns longer array than input (if income requested)
  const i = fields.indexOf('income.annual')
  if (i === -1) {
    return values
  }
  const incomeExpends = FY_END_YEARS.map(
    year => getAnnualIncomeObj(values[i], year)
  )
  return [
    ...values.slice(0, i),
    ...incomeExpends.map(x => x.income),
    ...incomeExpends.map(x => x.expend),
    ...values.slice(i + 1),
  ]
}

const getCSVParser = fieldPaths => esObj => {
  if (!fieldPaths || fieldPaths.length === 0) return `\n`
  let values = fieldPaths.map(getDescendantProp(esObj._source))
  values = valuesWithRegDate(fieldPaths, values)
  values = valuesWithIncome(fieldPaths, values) // warning: length might have changed!
  const stringValues = values.map(x => {
    if (x === null || x === undefined) {
      return ''
    }
    if (typeof x === 'string') {
      return x
    }
    return JSON.stringify(x)
  })
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
