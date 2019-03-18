const LATEST_REG_DATE_ES_FIELD = 'lastRegistrationDate'
const REGISTRATIONS_ES_FIELD = 'registrations'

async function getList(
  searchSource,
  { all }
) {
  try {
    const _source = all ? [
      LATEST_REG_DATE_ES_FIELD,
      REGISTRATIONS_ES_FIELD,
    ] : [
      LATEST_REG_DATE_ES_FIELD,
    ]

    const response = await searchSource({ _source })
    return response.hits.hits.map(doc => {
      if (!all) {
        return [{
          registrationDate: doc._source[LATEST_REG_DATE_ES_FIELD],
          removalDate: null,
          removalCode: null,
          removalReason: null,
        }]
      }
      return doc._source[REGISTRATIONS_ES_FIELD]
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
