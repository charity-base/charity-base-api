const crypto = require('crypto')
const { ALLOWED_CSV_FIELD_PATHS } = require('./constants')

const getAllowedCSVFieldPaths = fieldPaths => {
  const allowed = fieldPaths.reduce((agg, x) => (
    ALLOWED_CSV_FIELD_PATHS.indexOf(x) > -1 ? [...agg, x] : agg
  ), [])
  return allowed
}

const getFileName = (queryParams, fileType) => {
  const fileExtension = fileType === 'JSON' ? 'jsonl' : 'csv'
  const { limit, skip, frozen, view, download, ...other } = queryParams
  const filterNames = Object.keys(other)
  if (filterNames.length === 0) {
    return `all.${fileExtension}.gz`
  }
  const fileName = `${filterNames.reduce((agg, x) => `${agg}_${x}=${other[x]}`, '')}`
  const hexFileName = crypto.createHmac('sha256', 'my-secret').update(fileName).digest('hex')
  return `${hexFileName}.${fileExtension}.gz`
}

const getDescendantProp = obj => path => (
  path.split('.').reduce((acc, part) => acc ? acc[part] : '', obj)
)

module.exports = { getAllowedCSVFieldPaths, getDescendantProp, getFileName }
