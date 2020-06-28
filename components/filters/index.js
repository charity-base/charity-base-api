import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useRouter } from "next/router"
import IntegerRange from "./IntegerRange"
import { constructFilters, deconstructFilters } from "./helpers"

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
