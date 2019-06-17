const getFiltersOnStringList = require('./getFiltersOnStringList')

const getTrusteesFilters = trustees => getFiltersOnStringList(
  'trustees.objects.id',
  trustees,
)

module.exports = getTrusteesFilters
