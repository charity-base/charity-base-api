const getFiltersOnStringList = require('./getFiltersOnStringList')

const getCausesFilters = causes => getFiltersOnStringList(
  'causes.id',
  causes,
)

module.exports = getCausesFilters
