const getFiltersOnStringList = require('./getFiltersOnStringList')

const getAreasFilters = areas => getFiltersOnStringList(
  'areas.id',
  areas,
)

module.exports = getAreasFilters
