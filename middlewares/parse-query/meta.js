const { extractValues, numberOrDefault } = require('./helpers')

const DEFAULT_FIELDS = [
  'ids.GB-CHC',
  'name',
]

const DEFAULT_SORT = [
  'income.latest.total:desc',
  'ids.GB-CHC:asc',
]

const parseFields = q => {
  const fields = extractValues(q['fields'])
  return fields.length ? fields : DEFAULT_FIELDS
}

const parseSort = q => {
  return q['sort'] ? q['sort'] : DEFAULT_SORT
}

const parseMeta = q => {

  const meta = {
    _source: parseFields(q),
    sort: parseSort(q),
    size: numberOrDefault(q.limit, 10),
    from: numberOrDefault(q.skip, 0),
  }

  return meta
}

module.exports = parseMeta
