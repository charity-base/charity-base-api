const getFundersFilters = funders => {
  if (!funders) return []
  if (!funders.some || !funders.some.length) return []
  return [{
    bool: {
      should: funders.some.map(id => ({
        "match_phrase": { "grants.fundingOrganization.id": id }
      }))
    }
  }]
}

module.exports = getFundersFilters
