function includesNumber(arr) {
  return arr.map((x) => typeof x).indexOf("number") > -1
}

function deconstructFilters({ finances }) {
  const d = {}
  try {
    d.minIncome = finances.latestIncome.gte
  } catch (e) {}
  try {
    d.maxIncome = finances.latestIncome.lt
  } catch (e) {}
  try {
    d.minSpending = finances.latestSpending.gte
  } catch (e) {}
  try {
    d.maxSpending = finances.latestSpending.lt
  } catch (e) {}

  return d
}

function constructFilters({ minIncome, maxIncome, minSpending, maxSpending }) {
  const filters = {}
  if (includesNumber([minIncome, maxIncome, minSpending, maxSpending])) {
    filters.finances = {}
    if (includesNumber([minIncome, maxIncome])) {
      filters.finances.latestIncome = { gte: minIncome, lt: maxIncome }
    }
    if (includesNumber([minSpending, maxSpending])) {
      filters.finances.latestSpending = { gte: minSpending, lt: maxSpending }
    }
  }
  return filters
}

export { includesNumber, constructFilters, deconstructFilters }
