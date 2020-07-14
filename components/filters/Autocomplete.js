import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useCombobox } from "downshift"

const items = []
const DEBOUNCE_TIME = 300

let counter = 0

function fetchItems() {
  counter++
  console.log(`starting search ${counter}`)
  const ms = 1000 * (1 + Math.random())
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`ending search ${counter}`)
      resolve([...new Array(Math.round(Math.random() * 10))].map((_, i) => i))
    }, ms)
  })
}

function DropdownCombobox() {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [inputItems, setInputItems] = useState(items)

  useEffect(() => {
    let stale = false
    if (value) {
      const timeoutId = setTimeout(() => {
        setLoading(true)
        fetchItems().then((items) => {
          if (stale) return
          setInputItems(items)
          setLoading(false)
        })
      }, DEBOUNCE_TIME)

      return () => {
        stale = true
        clearTimeout(timeoutId)
      }
    }
  }, [value])

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setValue(inputValue)
    },
  })
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div className="" {...getComboboxProps()}>
        <input
          className="w-full px-1 text-sm border rounded focus:outline-none focus:border-gray-700 focus:shadow"
          placeholder="Start typing..."
          {...getInputProps()}
        />
        <button {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} className={`${loading ? "opacity-50" : ""}`}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default function Autocomplete({ title }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 font-semibold my-2">{title}</h3>
      </div>
      <div className="relative flex text-gray-700">
        <DropdownCombobox />
      </div>
    </div>
  )
}
Autocomplete.propTypes = {
  title: PropTypes.string.isRequired,
}
