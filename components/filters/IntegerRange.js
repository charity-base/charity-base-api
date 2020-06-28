import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { includesNumber } from "./helpers"

function stringToInt(str) {
  if (typeof str === "undefined") return undefined
  const int = parseInt(str)
  if (isNaN(int)) return undefined
  if (Math.abs(int) > 2 * Math.pow(10, 9)) return undefined
  return int
}

function hasError(valuesArr) {
  return valuesArr.reduce((agg, x) => {
    if (agg) return true
    if (typeof x === "undefined") return false
    return typeof stringToInt(x) === "undefined"
  }, false)
}

export default function IntegerRange({ initial, onChange, title }) {
  const [[min, max], setState] = useState(initial)
  const [error, setError] = useState(false)

  useEffect(
    () => {
      setState(initial)
      setError(hasError(initial))
    },
    [JSON.stringify(initial)],
    setState,
    setError
  )

  const update = (valuesArr) => {
    if (hasError(valuesArr)) {
      setError(true)
    } else {
      const clean = valuesArr.map(stringToInt)
      setError(false)
      setState(clean)
      onChange(clean)
    }
  }

  const inputClassName =
    "w-24 px-1 text-sm border rounded focus:outline-none focus:border-gray-700 focus:shadow"
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 font-semibold my-2">{title}</h3>
        <button
          className={`text-xs text-gray-700 border px-1 bg-gray-100 hover:bg-gray-200 rounded ${
            includesNumber(initial) ? "" : "hidden"
          }`}
          onClick={() => update([undefined, undefined])}
        >
          reset
        </button>
      </div>
      <div
        className="relative flex text-gray-700"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update([min, max])
          }
        }}
      >
        <input
          className={inputClassName}
          value={typeof min === "undefined" ? "" : min}
          placeholder="Minimum"
          onChange={(e) =>
            setState([e.target.value === "" ? undefined : e.target.value, max])
          }
          onBlur={() => update([min, max])}
        />
        <span className="px-1 text-gray-500">-</span>
        <input
          className={inputClassName}
          value={typeof max === "undefined" ? "" : max}
          placeholder="Maximum"
          onChange={(e) =>
            setState([min, e.target.value === "" ? undefined : e.target.value])
          }
          onBlur={() => update([min, max])}
        />
        {error ? (
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-full">
            <div className="bg-red-100 rounded shadow-xl text-xs text-red-500 mt-1 py-1 px-2">
              Must be integers ≤ 2 &#215; 10<sup>9</sup>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
IntegerRange.propTypes = {
  initial: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
}
IntegerRange.defaultProps = {
  initial: [undefined, undefined],
}
