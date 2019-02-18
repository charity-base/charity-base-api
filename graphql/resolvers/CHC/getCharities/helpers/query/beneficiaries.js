const getBeneficiariesFilters = beneficiaries => {
  if (!beneficiaries) return []
  if (!beneficiaries.some || !beneficiaries.some.length) return []
  const ids = beneficiaries.some.map(x => parseInt(x)).filter(x => !isNaN(x))
  if (ids.length === 0) {
    // all values provided were of invalid form, return none
    return [{
      "match_none": {}
    }]
  }
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "beneficiaries.id": id }
      }))
    }
  }]
}

module.exports = getBeneficiariesFilters
