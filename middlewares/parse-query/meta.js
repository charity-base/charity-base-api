const { extractValues, numberOrDefault } = require('./helpers')

const DEFAULT_FIELDS = [
  'ids',
  'name',
]

const DEFAULT_SORT = [
  '_score',
  'income.latest.total:desc',
  'ids.GB-CHC:asc',
]

const parseFields = q => {
  const fields = extractValues(q['fields'])
  const unique = new Set([...DEFAULT_FIELDS, ...fields])
  return [...unique]
}

const parseSort = q => {
  return q['sort'] ? [q['sort'], ...DEFAULT_SORT] : DEFAULT_SORT
}

const parseMeta = q => {

  const meta = {
    _source: parseFields(q),
    sort: parseSort(q),
    size: Math.min(numberOrDefault(q.limit, 10), 50),
    from: numberOrDefault(q.skip, 0),
  }

  return meta
}

module.exports = parseMeta
