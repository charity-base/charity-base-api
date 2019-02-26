const getFiltersOnIntegerList = require('./getFiltersOnIntegerList')

const getCausesFilters = causes => getFiltersOnIntegerList(
  'causes.id',
  causes,
)

module.exports = getCausesFilters
