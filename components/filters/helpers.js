function includesNumber(arr) {
  return arr.map((x) => typeof x).indexOf("number") > -1
}

function deconstructFilters({ finances, grants }) {
  const flat = {
    incomeRange: [undefined, undefined],
    spendingRange: [undefined, undefined],
    fundersRange: [undefined, undefined],
  }

  try {
    const { gte, lt } = finances.latestIncome
    flat.incomeRange = [gte, lt]
  } catch {}

  try {
    const { gte, lt } = finances.latestSpending
    flat.spendingRange = [gte, lt]
  } catch {}

  try {
    const { gte, lt } = grants.funders.length
    flat.fundersRange = [gte, lt]
  } catch {}

  return flat
}

function constructFilters({ incomeRange, spendingRange, fundersRange }) {
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

  if (includesNumber(fundersRange)) {
    filters.grants = {
      funders: {
        length: {
          gte: fundersRange[0],
          lt: fundersRange[1],
        },
      },
    }
  }

  return filters
}

export { includesNumber, constructFilters, deconstructFilters }
