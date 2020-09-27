const ID_FIELD = "chcId"

const getIdFilters = (id) => {
  if (!id || !id.length) return []
  return [
    {
      bool: {
        should: id.map((x) => ({
          term: {
            [ID_FIELD]: x,
          },
        })),
      },
    },
  ]
}

module.exports = getIdFilters
