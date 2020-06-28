import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useRouter } from "next/router"
import IntegerRange from "./IntegerRange"
import { constructFilters, deconstructFilters } from "./helpers"

export default function Filters(filters) {
  const router = useRouter()
  const [{ incomeRange, spendingRange, fundersRange }, setState] = useState(
    deconstructFilters(filters)
  )

  useEffect(() => {
    const filtersString = JSON.stringify(
      constructFilters({
        incomeRange,
        spendingRange,
        fundersRange,
      })
    )
    const query = filtersString === "{}" ? {} : { filters: filtersString }
    router.push({
      pathname: "/chc",
      query,
    })
    window.scrollTo(0, 0)
  }, [...incomeRange, ...spendingRange, ...fundersRange])

  return (
    <div className="p-3 border border-gray-400 rounded">
      <div className="space-y-3">
        <IntegerRange
          title="Income (£)"
          initial={incomeRange}
          onChange={(incomeRange) => {
            setState((x) => ({
              ...x,
              incomeRange,
            }))
          }}
        />
        <IntegerRange
          title="Spending (£)"
          initial={spendingRange}
          onChange={(spendingRange) => {
            setState((x) => ({
              ...x,
              spendingRange,
            }))
          }}
        />
        <IntegerRange
          title="Number of Funders"
          initial={fundersRange}
          onChange={(fundersRange) => {
            setState((x) => ({
              ...x,
              fundersRange,
            }))
          }}
        />
      </div>
    </div>
  )
}
