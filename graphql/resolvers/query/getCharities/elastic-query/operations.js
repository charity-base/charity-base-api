const getFiltersOnStringList = require('./getFiltersOnStringList')

const getOperationsFilters = operations => getFiltersOnStringList(
  'operations.id',
  operations,
)

module.exports = getOperationsFilters
