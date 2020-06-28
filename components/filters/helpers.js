function includesNumber(arr) {
  return arr.map((x) => typeof x).indexOf("number") > -1
}

function deconstructFilters({ finances }) {
  const d = {
    incomeRange: [undefined, undefined],
    spendingRange: [undefined, undefined],
  }
  try {
    d.incomeRange = [finances.latestIncome.gte, finances.latestIncome.lt]
  } catch {}
  try {
    d.spendingRange = [finances.latestSpending.gte, finances.latestSpending.lt]
  } catch {}

  return d
}

function constructFilters({ incomeRange, spendingRange }) {
  const filters = {}
  if (includesNumber([...incomeRange, ...spendingRange])) {
    filters.finances = {}
    if (includesNumber(incomeRange)) {
      filters.finances.latestIncome = {
        gte: incomeRange[0],
        lt: incomeRange[1],
      }
    }
    if (includesNumber(spendingRange)) {
      filters.finances.latestSpending = {
        gte: spendingRange[0],
        lt: spendingRange[1],
      }
    }
  }
  return filters
}

export { includesNumber, constructFilters, deconstructFilters }
