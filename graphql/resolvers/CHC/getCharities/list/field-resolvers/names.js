const NAME_ES_FIELD = 'name'
const ALTERNATIVE_NAMES_ES_FIELD = 'alternativeNames'

async function getList(
  searchSource,
  { all }
) {
  try {
    const _source = all ? [
      NAME_ES_FIELD,
      ALTERNATIVE_NAMES_ES_FIELD,
    ] : [
      NAME_ES_FIELD,
    ]

    const response = await searchSource({ _source })
    return response.hits.hits.map(doc => {
      if (!all) {
        return [{
          value: doc._source[NAME_ES_FIELD],
          primary: true,
        }]
      }
      return doc._source[ALTERNATIVE_NAMES_ES_FIELD].map(value => ({
        value,
        primary: value === doc._source[NAME_ES_FIELD],
      }))
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
