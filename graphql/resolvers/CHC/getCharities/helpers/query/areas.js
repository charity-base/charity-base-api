const getAreasFilters = areas => {
  if (!areas) return []
  if (!areas.some || !areas.some.length) return []
  return [{
    bool: {
      should: areas.some.map(id => ({
        "match_phrase": { "areasOfOperation.id": id }
      }))
    }
  }]
}

module.exports = getAreasFilters
