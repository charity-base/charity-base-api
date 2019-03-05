const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')

const esIndex = config.elastic.indexes.chc

// Note this is not the same as the FilteredCharitiesCHC.count resolver (additional args)
async function countCharities(esQuery) {
  const searchParams = {
    index: [esIndex],
    body: {
      query: esQuery,
    },
  }

  try {
    const response = await esClient.count(searchParams)
    return response.count
  } catch(e) {
    throw e
  }
}

module.exports = countCharities
