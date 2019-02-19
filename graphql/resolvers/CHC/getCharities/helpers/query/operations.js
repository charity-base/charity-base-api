const getFiltersOnIntegerList = require('./getFiltersOnIntegerList')

const getOperationsFilters = operations => getFiltersOnIntegerList(
  'operations.id',
  operations,
)

module.exports = getOperationsFilters
