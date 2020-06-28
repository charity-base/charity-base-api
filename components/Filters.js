import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useRouter } from "next/router"
import IntegerRange from "components/IntegerRange"

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

function includesNumber(arr) {
  return arr.map((x) => typeof x).indexOf("number") > -1
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

export default function Filters(filters) {
  const router = useRouter()
  const [
    { minIncome, maxIncome, minSpending, maxSpending },
    setState,
  ] = useState(deconstructFilters(filters))

  useEffect(() => {
    const filtersString = JSON.stringify(
      constructFilters({
        minIncome,
        maxIncome,
        minSpending,
        maxSpending,
      })
    )
    const query = filtersString === "{}" ? {} : { filters: filtersString }
    router.push({
      pathname: "/chc",
      query,
    })
    window.scrollTo(0, 0)
  }, [minIncome, maxIncome, minSpending, maxSpending])

  return (
    <div className="p-3 border border-gray-400 rounded">
      <div className="space-y-3">
        <IntegerRange
          title="Income (£)"
          initial={[minIncome, maxIncome]}
          onChange={([minIncome, maxIncome]) => {
            setState((x) => ({
              ...x,
              minIncome,
              maxIncome,
            }))
          }}
        />
        <IntegerRange
          title="Spending (£)"
          initial={[minSpending, maxSpending]}
          onChange={([minSpending, maxSpending]) => {
            setState((x) => ({
              ...x,
              minSpending,
              maxSpending,
            }))
          }}
        />
      </div>
    </div>
  )
}
