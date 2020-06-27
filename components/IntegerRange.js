import { useState, useEffect } from "react"
import PropTypes from "prop-types"

function stringToInt(str) {
  if (typeof str === "undefined") return undefined
  const int = parseInt(str)
  if (isNaN(int)) return undefined
  return int
}

export default function IntegerRange({ initial, onChange }) {
  const [[min, max], setState] = useState(initial)

  useEffect(() => {
    setState(initial)
  }, [JSON.stringify(initial)])

  const update = () => {
    onChange([min, max].map(stringToInt))
  }

  const inputClassName =
    "w-24 px-1 text-sm border rounded focus:outline-none focus:border-gray-700 focus:shadow"
  return (
    <div
      className="flex text-gray-700"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          update()
        }
      }}
    >
      <input
        className={inputClassName}
        value={min || ""}
        placeholder="Minimum"
        onChange={(e) =>
          setState([e.target.value === "" ? undefined : e.target.value, max])
        }
        onBlur={update}
      />
      <span className="px-1 text-gray-500">-</span>
      <input
        className={inputClassName}
        value={max || ""}
        placeholder="Maximum"
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
