const getFiltersOnStringList = require('./getFiltersOnStringList')
const CAUSE_ID_FIELD = 'causes.id'

const getCausesFilters = causes => getFiltersOnStringList(
  CAUSE_ID_FIELD,
  causes,
)

module.exports = getCausesFilters
