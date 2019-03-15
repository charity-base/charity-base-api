async function countCharities(search) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
    },
    size: 0,
    from: undefined,
  }

  try {
    const response = await search(searchParams)
    return response.hits.total
  } catch(e) {
    throw e
  }
}

module.exports = countCharities
