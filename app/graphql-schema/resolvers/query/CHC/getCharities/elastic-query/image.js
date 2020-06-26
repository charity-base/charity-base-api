const SMALL_LOGO_FIELD = "image.logo.small.path"
const MEDIUM_LOGO_FIELD = "image.logo.medium.path"

const exists = (field) => ({
  exists: {
    field,
  },
})

const notExists = (field) => ({
  bool: {
    must_not: {
      exists: {
        field,
      },
    },
  },
})

const getFilters = (image) => {
  if (!image) return []

  const filters = []

  if (typeof image.smallLogoExists !== "undefined") {
    filters.push(
      image.smallLogoExists
        ? exists(SMALL_LOGO_FIELD)
        : notExists(SMALL_LOGO_FIELD)
    )
  }

  if (typeof image.mediumLogoExists !== "undefined") {
    filters.push(
      image.mediumLogoExists
        ? exists(MEDIUM_LOGO_FIELD)
        : notExists(MEDIUM_LOGO_FIELD)
    )
  }

  return filters
}

module.exports = getFilters
