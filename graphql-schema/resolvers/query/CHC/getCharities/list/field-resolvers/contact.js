const ES_FIELDS = [
  "contact.address",
  "contact.email",
  "contact.phone",
  "contact.postcode",
  "social",
]

const getSocialList = (social) => {
  if (!social) {
    return []
  }
  const arr = []
  if (social.facebook) {
    arr.push({
      platform: "facebook",
      handle: social.facebook,
    })
  }
  if (social.instagram) {
    arr.push({
      platform: "instagram",
      handle: social.instagram,
    })
  }
  if (social.twitter) {
    arr.push({
      platform: "twitter",
      handle: social.twitter,
    })
  }
  return arr
}

async function getList(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) => ({
      ...x._source.contact,
      social: getSocialList(x._source.social),
    }))
  } catch (e) {
    throw e
  }
}

module.exports = getList
