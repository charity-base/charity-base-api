import PropTypes from "prop-types"

export default function Autocomplete({ title }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 font-semibold my-2">{title}</h3>
      </div>
      <div className="relative flex text-gray-700">
        <input
          className="w-full px-1 text-sm border rounded opacity-50 cursor-not-allowed"
          placeholder="Start typing..."
          disabled
        />
      </div>
    </div>
  )
}
Autocomplete.propTypes = {
  title: PropTypes.string.isRequired,
}
