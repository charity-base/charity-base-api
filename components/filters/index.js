import PropTypes from "prop-types"
import { useRouter } from "next/router"
import Autocomplete from "./Autocomplete"
import IntegerRange from "./IntegerRange"
import { constructFilters, deconstructFilters } from "./helpers"

export default function Filters({ finances, grants }) {
  const router = useRouter()
  const flatFilters = deconstructFilters({ finances, grants })

  function updateQuery(key, value) {
    const changed = JSON.stringify(flatFilters[key]) !== JSON.stringify(value)
    if (!changed) return

    const filtersString = JSON.stringify(
      constructFilters({
        ...flatFilters,
        [key]: value,
      })
    )
    const query = filtersString === "{}" ? {} : { filters: filtersString }
    router.push({
      pathname: "/chc",
      query,
    })
    window.scrollTo(0, 0)
  }

  return (
    <div className="p-3">
      <div className="space-y-3">
        <IntegerRange
          title="Income (£)"
          initial={flatFilters.incomeRange}
          onChange={(x) => {
            updateQuery("incomeRange", x)
          }}
        />
        <IntegerRange
          title="Spending (£)"
          initial={flatFilters.spendingRange}
          onChange={(x) => {
            updateQuery("spendingRange", x)
          }}
        />
        <IntegerRange
          title="Number of Funders"
          initial={flatFilters.fundersRange}
          onChange={(x) => {
            updateQuery("fundersRange", x)
          }}
        />
        <Autocomplete title="Funder" filterType="funder" />
        <Autocomplete title="County" filterType="" />
        <Autocomplete title="Local Authority" filterType="" />
        <Autocomplete title="Areas" filterType="area" />
        <Autocomplete title="Causes" filterType="cause" />
        <Autocomplete title="Operations" filterType="operation" />
        <Autocomplete title="Beneficiaries" filterType="beneficiary" />
        <Autocomplete title="Trustees" filterType="trustee" />
        <Autocomplete title="Themes" filterType="topic" />
      </div>
    </div>
  )
}

const rangeType = PropTypes.shape({
  gte: PropTypes.number,
  lt: PropTypes.number,
})

Filters.propTypes = {
  finances: PropTypes.shape({
    latestIncome: rangeType,
    latestSpending: rangeType,
  }),
  grants: PropTypes.shape({
    funders: PropTypes.shape({
      length: rangeType,
    }),
  }),
}
