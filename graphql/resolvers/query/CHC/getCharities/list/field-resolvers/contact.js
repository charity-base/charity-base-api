const ES_FIELDS = [
  'contact.address',
  'contact.email',
  'contact.person',
  'contact.phone',
  'contact.postcode',
  'contact.social',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.contact)
  } catch(e) {
    throw e
  }
}

module.exports = getList
