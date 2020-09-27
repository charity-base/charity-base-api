const { esClient } = require("../../../../../connection")

const { CHARITY_BASE_ES_AWS_INDEX_CHC_FILTER } = process.env

const MAX_SUGGESTIONS = 12

const FILTER_TYPES = [
  { id: "trustee", weight: 1.2 },
  { id: "id", weight: 2 },
  { id: "area", weight: 3 },
  { id: "funder", weight: 4 },
  { id: "topic", weight: 10 },
  { id: "cause", weight: 5 },
  { id: "operation", weight: 5 },
  { id: "beneficiary", weight: 5 },
]

async function getFilters({ filterType, id, search }) {
  const filterIds = id && id.length > 0
  const cleanSearch =
    search &&
    search
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  if (!filterIds && !cleanSearch) return []

  const searchParams = {
    index: [CHARITY_BASE_ES_AWS_INDEX_CHC_FILTER],
    body: {},
    _source: ["id", "value", "label", "filterType"],
    size: MAX_SUGGESTIONS,
    from: 0,
  }

  // warning: filterType only filters if values are in FILTER_TYPES
  // e.g. filterType=['fake'] will return all filter types.

  searchParams.body.query = {
    function_score: {
      query: {
        bool: {
          minimum_should_match: cleanSearch ? 1 : 0,
          should: cleanSearch
            ? [
                {
                  match: {
                    suggest: {
                      query: cleanSearch,
                      operator: "and",
                      fuzziness: "AUTO",
                    },
                  },
                },
                {
                  // we include a non-fuzzy search to ensure that exact matches have a higher score
                  match: {
                    suggest: {
                      query: cleanSearch,
                      operator: "and",
                    },
                  },
                },
              ]
            : [],
          filter: [
            {
              bool: {
                should: filterType
                  ? FILTER_TYPES.filter(
                      (x) => filterType.indexOf(x.id) > -1
                    ).map((x) => ({
                      term: { filterType: x.id },
                    }))
                  : [],
              },
            },
            {
              bool: {
                should: id
                  ? id.map((x) => ({
                      term: { id: x },
                    }))
                  : [],
              },
            },
          ],
        },
      },
      functions: FILTER_TYPES.map((x) => ({
        filter: {
          term: { filterType: x.id },
        },
        weight: x.weight,
      })),
    },
  }

  try {
    const response = await esClient.search(searchParams)
    const hits = response.hits.hits.map((x) => ({
      ...x._source,
      score: x._score,
    }))
    return hits
  } catch (e) {
    throw e
  }
}

module.exports = getFilters
