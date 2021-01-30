const FACEBOOK_FIELD = "social.facebook"
const INSTAGRAM_FIELD = "social.instagram"
const TWITTER_FIELD = "social.twitter"

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

const getFilters = (social) => {
  if (!social) return []

  const filters = []

  if (typeof social.facebookExists !== "undefined") {
    filters.push(
      social.facebookExists ? exists(FACEBOOK_FIELD) : notExists(FACEBOOK_FIELD)
    )
  }

  if (typeof social.instagramExists !== "undefined") {
    filters.push(
      social.instagramExists
        ? exists(INSTAGRAM_FIELD)
        : notExists(INSTAGRAM_FIELD)
    )
  }

  if (typeof social.twitterExists !== "undefined") {
    filters.push(
      social.twitterExists ? exists(TWITTER_FIELD) : notExists(TWITTER_FIELD)
    )
  }

  return filters
}

module.exports = getFilters
