const REGISTRATIONS_ES_FIELD = "registrations"

async function getList(searchSource, { all }) {
  try {
    const _source = [REGISTRATIONS_ES_FIELD]

    const response = await searchSource({ _source })
    return response.hits.hits.map((doc) => {
      const registrations = doc._source[REGISTRATIONS_ES_FIELD]
      return all ? registrations : registrations.slice(0, 1)
    })
  } catch (e) {
    throw e
  }
}

module.exports = getList
