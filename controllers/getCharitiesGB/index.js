const listCharitiesGB = ({ filters, limit, skip, sort }) => {
  return [{
    id: 'dummy-id',
    name: 'dummy-name',
    activities: `dummy-activities from search: '${filters.search}'`,
  }]
}

class FilteredCharitiesGB {
  constructor(filters) {
    this.filters = filters
  }
  list({ limit, skip, sort }) {
    return listCharitiesGB({
      filters: this.filters,
      limit,
      skip,
      sort,
    })
  }
}

const getCharitiesGB = ({ filters }) => {
  return new FilteredCharitiesGB(filters)
}

module.exports = getCharitiesGB