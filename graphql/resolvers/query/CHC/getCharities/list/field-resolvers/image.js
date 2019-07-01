const { s3 } = require('../../../../../../../connection')
const ES_FIELDS = [
  'image',
]

const LINK_EXPIRES_SECONDS = 24*60*60

async function getImage(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      if (!x._source.image || !x._source.image.logo) return null
      const image = {
        logo: Object.keys(x._source.image.logo).reduce((agg, size) => {
          const { Bucket, Key } = x._source.image.logo[size]
          if (!Bucket || !Key) return agg
          return {
            ...agg,
            [size]: s3.getSignedUrl('getObject', { Bucket, Key, Expires: LINK_EXPIRES_SECONDS })
          }
        }, {})
      }
      return image
    })
  } catch(e) {
    throw e
  }
}

module.exports = getImage
