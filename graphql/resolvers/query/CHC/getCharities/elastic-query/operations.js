const getFiltersOnStringList = require('./getFiltersOnStringList')
const OPERATION_ID_FIELD = 'operations.id'

const getOperationsFilters = operations => getFiltersOnStringList(
  OPERATION_ID_FIELD,
  operations,
)

module.exports = getOperationsFilters
