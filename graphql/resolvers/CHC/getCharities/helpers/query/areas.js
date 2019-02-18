const getAreasFilters = areas => {
  if (!areas) return []
  if (!areas.some) return []
  return [{
    bool: {
      should: areas.some.map(id => ({
        "match_phrase": { "areasOfOperation.id": id }
      }))
    }
  }]
}

module.exports = getAreasFilters