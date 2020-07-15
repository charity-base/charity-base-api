import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useCombobox } from "downshift"

const items = []
const DEBOUNCE_TIME = 300

const URL = "https://charitybase.uk/api/graphql"
const HEADERS = {
  Authorization: `Apikey ${process.env.NEXT_PUBLIC_CB_SANDBOX_API_KEY}`,
  "Content-Type": "application/json",
}
const GQL_LIST_FILTERS = `
query ListFiltersCHC($search: String, $filterType: [String]) {
  CHC {
    getFilters(search: $search, filterType: $filterType) {
      id
      value
      label
      filterType
    }
  }
}
`

function fetchItems({ search, filterType }) {
  return fetch(URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      query: GQL_LIST_FILTERS,
      variables: { search, filterType },
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("FETCH ERROR (probably your network)")
      throw err
    })
    .then(({ data, errors }) => {
      if (errors) {
        console.error("QUERY ERRORS")
        throw errors
      }
      return data.CHC.getFilters
    })
}

function DropdownCombobox({ title, filterType, initial, onChange }) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [inputItems, setInputItems] = useState(items)
  const [filters, setFilters] = useState(initial)

  useEffect(() => {
    let stale = false
    const timeoutId = setTimeout(() => {
      if (stale) return
      if (!value) {
        setLoading(false)
        setInputItems([])
      } else {
        setLoading(true)
        fetchItems({ search: value, filterType }).then((items) => {
          if (stale) return
          setInputItems(items)
          setLoading(false)
        })
      }
    }, DEBOUNCE_TIME)

    return () => {
      stale = true
      clearTimeout(timeoutId)
    }
  }, [value, filterType])

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
    selectedItem: null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (filters.some((x) => x.id === selectedItem.id)) return
      setFilters([...filters, selectedItem])
    },
    onInputValueChange: ({ inputValue }) => {
      setValue(inputValue)
    },
  })
  return (
    <div className="w-full">
      <label {...getLabelProps()}>
        <h3 className="text-gray-700 font-semibold my-2">{title}</h3>
      </label>
      <div className="relative">
        <div className="relative text-sm" {...getComboboxProps()}>
          <input
            className="w-full px-1 pr-4 border rounded focus:outline-none focus:border-gray-700 focus:shadow"
            placeholder="Start typing..."
            {...getInputProps()}
          />
          <button
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            className="absolute right-0 h-full mr-1"
          >
            &#8595;
          </button>
        </div>
        <ul
          {...getMenuProps()}
          className={`absolute bg-white z-50 bottom-0 left-0 right-0 transform translate-y-full px-4 py-4 space-y-4 border shadow-xl rounded ${
            isOpen ? "" : "hidden"
          }`}
        >
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={
                    highlightedIndex === index
                      ? { backgroundColor: "#bde4ff" }
                      : {}
                  }
                  key={`${item.id}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.label}
                </li>
              ))
            : null}
          {loading ? (
            <div className="absolute inset-0 bg-white bg-opacity-50" />
          ) : null}
        </ul>
      </div>
      <ul className="text-sm">
        {filters.map((x) => (
          <li key={x.id} className="bg-gray-100 rounded-full px-2 py-1 my-1">
            {x.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Autocomplete({ title, filterType }) {
  return (
    <div>
      {/* <div className="flex justify-between items-center"></div> */}
      <div className="relative flex text-gray-700">
        <DropdownCombobox
          title={title}
          filterType={filterType}
          initial={[]}
          onChange={() => {}}
        />
      </div>
    </div>
  )
}
Autocomplete.propTypes = {
  title: PropTypes.string.isRequired,
}
