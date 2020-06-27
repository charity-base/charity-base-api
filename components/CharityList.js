import PropTypes from "prop-types"

function CharityListItem({ activities, names, image, registrations }) {
  const primaryName = names.reduce((agg, x) => (x.primary ? x.value : agg), "")
  return (
    <li className="py-4 flex overflow-hidden">
      <div className="w-12 h-12 border rounded-full flex-shrink-0 bg-gray-300 overflow-hidden">
        {image && image.logo && image.logo.small ? (
          <img className="w-full h-full" src={image.logo.small} alt="Logo" />
        ) : null}
      </div>
      <div className="relative ml-2 min-w-0 flex-grow">
        <div className="flex justify-between items-start space-x-2">
          <h2 className="font-bold tracking-wide">{primaryName}</h2>
        </div>
        <div className="hidden sm:block absolute top-0 right-0 text-sm text-gray-700 text-right pr-1">
          <div>Est. {registrations[0].registrationDate.split("-")[0]}</div>
        </div>
        <p className="text-gray-700 py-2">{activities}</p>
      </div>
    </li>
  )
}
CharityListItem.propTypes = {
  id: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired,
    })
  ).isRequired,
  activities: PropTypes.string.isRequired,
  // image
  // registrations
}

function CharityList({ charities }) {
  return (
    <ul className="divide-y-2 divide-gray-200 px-2 md:px-6">
      {charities.map((charity) => (
        <CharityListItem key={charity.id} {...charity} />
      ))}
    </ul>
  )
}

export default CharityList
