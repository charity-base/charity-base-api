import { useState, useCallback } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { useRouter } from "next/router"
import getCharitiesList from "web-lib/getCharitiesList"
import CharityList from "components/CharityList"

function stringToInt(str) {
  if (typeof str === "undefined") return undefined
  const int = parseInt(str)
  if (isNaN(int)) return undefined
  return int
}

function IntegerRange({ initial, onChange }) {
  const [[min, max], setState] = useState(initial)
  const update = useCallback(() => {
    onChange([min, max].map(stringToInt))
  }, [min, max])

  const inputClassName = "w-24 px-1 text-sm border rounded"
  return (
    <div className="flex text-gray-700">
      <input
        className={inputClassName}
        value={min || ""}
        placeholder="Min"
        onChange={(e) =>
          setState([e.target.value === "" ? undefined : e.target.value, max])
        }
        onBlur={update}
      />
      <span className="px-1">-</span>
      <input
        className={inputClassName}
        value={max || ""}
        placeholder="Max"
        onChange={(e) =>
          setState([min, e.target.value === "" ? undefined : e.target.value])
        }
        onBlur={update}
      />
    </div>
  )
}
IntegerRange.propTypes = {
  initial: PropTypes.array,
  onChange: PropTypes.func.isRequired,
}
IntegerRange.defaultProps = {
  initial: [undefined, undefined],
}

function Filters({ finances }) {
  const router = useRouter()
  const latestIncome =
    finances && finances.latestIncome ? finances.latestIncome : {}

  const update = useCallback((f) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        filters: JSON.stringify(f || {}),
      },
    })
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold my-2">Filters</h2>
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold">Income</h3>
          <IntegerRange
            initial={[latestIncome.gte, latestIncome.lt]}
            onChange={([gte, lt]) => {
              update({
                finances: {
                  latestIncome: { gte, lt },
                },
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ({ count, list, filters }) {
  return (
    <div className="max-w-5xl mx-auto flex px-2 sm:px-4 md:px-8">
      <Head>
        <title>CharityBase Search</title>
        <meta property="og:title" content="CharityBase Search" key="title" />
        <meta name="Description" content="CharityBase England & Wales Search" />
      </Head>
      <aside className="flex-shrink-0 py-24 pr-8 xl:pr-16 sticky top-0 h-screen overflow-auto">
        <Filters {...filters} />
      </aside>
      <div className="py-24">
        <div>{count} charities</div>
        <CharityList charities={list} />
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  let filters
  try {
    filters = JSON.parse(query.filters)
  } catch (e) {
    filters = {}
  }
  const { count, list } = await getCharitiesList({
    filters,
    skip: 0,
  })
  return {
    props: {
      filters,
      count,
      list,
    },
  }
}
