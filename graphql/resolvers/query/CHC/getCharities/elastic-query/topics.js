const getFiltersOnStringList = require('./getFiltersOnStringList')

const getTopicsFilters = topics => getFiltersOnStringList(
  'topics.id',
  topics,
)

module.exports = getTopicsFilters
