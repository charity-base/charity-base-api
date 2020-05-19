const ES_FIELDS = ["image"]

const { CHARITY_BASE_CDN_DOMAIN } = process.env

async function getImage(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) => {
      if (!x._source.image || !x._source.image.logo) return null
      const image = {
        logo: Object.keys(x._source.image.logo).reduce((agg, size) => {
          const { path } = x._source.image.logo[size]
          if (!path) return agg
          return {
            ...agg,
            [size]: `https://${CHARITY_BASE_CDN_DOMAIN}/${path}`,
          }
        }, {}),
      }
      return image
    })
  } catch (e) {
    throw e
  }
}

module.exports = getImage
