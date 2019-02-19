const getFiltersOnStringList = require('./getFiltersOnStringList')

const getAreasFilters = areas => getFiltersOnStringList(
  'areasOfOperation.id',
  areas,
)

module.exports = getAreasFilters
