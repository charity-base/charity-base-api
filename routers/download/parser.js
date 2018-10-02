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

const valuesWithIncome = (fields, values) => {
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
  const values = fieldPaths.map(getDescendantProp(esObj._source))
  const stringValues = valuesWithIncome(
    fieldPaths,
    values
  ).map(x => {
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
